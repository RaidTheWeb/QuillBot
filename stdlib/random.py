"""Random Module for the Quill language, built on top of Python's random module."""
import sys
sys.path.append("../src")

import data as data
import errors as errors
import random as r

def randint(*args):
    """Return a random number between range(a, b)."""
    if len(args) < 2:
        errors.error(f'Random needs 2 arguments, but only got {len(args)}')
    a = float(args[0].val)
    b = float(args[1].val)

    if round(a) != a or round(b) != b:
        return data.Number(r.uniform(a, b))
    else:
        return data.Number(r.randint(a, b))

def choice(**kwargs):
    """Return a random choice from a list of arguements."""
    if len(kwargs) != 1:
        errors.error(f'Choice needs 1 arguement, but got {len(kwargs)}')

    else:
        return data.Type(r.choice(kwargs))

def alpha_random(*args):
    """Return an alpha random choice. Alpha random refering to a value between 0.0 and 1.0."""
    if len(args) != 0:
        errors.error(f'Alpha_random does not need any arguements, but got {len(args)}')
    else:
        return data.Number(r.random())

attrs = {
    'choice': data.Method(choice),
    'randint':data.Method(randint),
}
