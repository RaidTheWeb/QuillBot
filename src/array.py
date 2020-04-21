"""Advanced array module built for Quill on top of Python's NumPy module, see the [docs](https://numpy.org/)."""
import numpy as np

def array(*list_, dtype='int32'):
    return np.array(list_, dtype=dtype)