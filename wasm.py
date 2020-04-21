'''
wasm.py - Wasm generation
WARNING: Before you touch this file, read webassembly.org and the MDN page on Wasm!
Basic concepts:
    Number - a number, in the system byte order, between 1 and 4 bytes in size
    Section - a specific group of bytes to represent part of a program - for example, exported functions, or imports
    Vector - a list, composed of the size of it as a number, followed by the body
'''

import sys
import math
BYTEORDER = sys.byteorder

i32 = 0x7f # Types
i64 = 0x7e
f32 = 0x7d
f64 = 0x7c

size = lambda x: min(4, int(max(math.log(x if x else 1, 2) - 7, 1))) # Computes how many bytes are needed to store a number

ops = { # Opcodes for operators
    '+':0x7c,
    '-':0x7d,
    '*':0x7e,
    '/':0x7f,
    '==':0x51,
    '!=':0x52,
    '<':0x53,
    '>':0x55,
    '<=':0x57,
    '>=':0x59,
}

class Wasm():
    def __init__(self, file):
        self.file = open(file, 'wb') # The output file
        self.magic = bytearray('\x00asm', 'utf-8') # The Wasm magic bytes
        self.file.write(self.magic) # Write the magic bytes
        self.version = int.to_bytes(1, 4, BYTEORDER) # The Wasm version, 1
        self.file.write(self.version) # Write the version
    def write_section(self, id, data):
        '''
        Writes one section to the file.
        Section format:
            Section ID - 1 byte
            Data (vector)
        '''
        section = int.to_bytes(id, 1, BYTEORDER) + vector(data) # Create the section
        self.file.write(section) # Write it
    def type_section(self, *funcs):
        '''
        Writes the type section.
        This section contains data on what types functions take and return.
        '''
        data = []
        for func in funcs:
            param, res = func # Each function is a [param, res] list
            data.append(bytearray([0x60]) + vector(param) + vector(res)) # Functions are a vector of parameters and results
        self.write_section(0x01, vector(data, True)) # Type section has ID 1
    def func_section(self, *funcs):
        '''
        The function section.
        This contains the function signatures.
        '''
        self.write_section(0x03, vector(bytearray(funcs))) # Section has ID 3
    def code_section(self, *funcs):
        '''
        The code section.
        This contains the actual function bodies.
        '''
        data = bytearray([]) # Again, we need the size
        for func in funcs:
            data += func # Add each function to the data
        self.write_section(0x0a, vector([data], True)) # Section has ID 0x0a
    def export_section(self, *funcs):
        '''
        The export section.
        This contains data about each exported function.
        '''
        data = bytearray([])
        for func in funcs:
            name, index = func # Get the name, type (0 for functions), and signature
            data += vector(bytearray(name, 'utf-8')) + \
                int.to_bytes(0, 1, BYTEORDER) + int.to_bytes(index, size(index), BYTEORDER)
                # Name size
                # Name as a valid JS string
                # Type
                # Signature (basically just a function index, ie., 0 for first function, 1 for second, etc.)
        self.write_section(0x07, vector([data], True))
    def close(self):
        '''
        Closes the output file.
        '''
        self.file.close()

def inst(opcode, *args):
    '''
    Creates an instruction, really just easier to type than bytearray
    '''
    return int.to_bytes(opcode, 1, BYTEORDER) + bytearray(args)

def vector(data, redo=False, add=0, want=0):
    '''
    Creates a vector.
    Redo is really only used to pass raw bytearrays:
        for a normal vector, use vector(data)
        for a weird vector, use vector([data], True)
    '''
    return int.to_bytes(len(data) + add, size(want if want else len(data) + add), BYTEORDER) + (bytearray(*data) if redo else data)

def func(locals, body):
    '''
    Creates a function.
    Function format:
        Function size, including locals - 1-4 bytes
        Local declaration count - 1-4 bytes
        Function body
    '''
    l = len(lvec(locals)) + len(body)
    return int.to_bytes(l, size(l), BYTEORDER) + lvec(locals) + body

def lvec(types):
    '''
    Creates a vector of locals.
    '''
    new = set(types)
    out = bytearray([])
    for type in new:
        c = types.count(type) # Each entry is a count followed by a type
        out += int.to_bytes(c, size(c), BYTEORDER) + int.to_bytes(type, 1, BYTEORDER)
    return vector([out], True) # Make a vector
