import { Builtin } from '../object/object';

import array_first from './builtins/array_first';
import array_last from './builtins/array_last';
import array_len from './builtins/array_len';
import array_push from './builtins/array_push';
import array_rest from './builtins/array_rest';
import date_iso from './builtins/date_iso';
import date_locale from './builtins/date_locale';
import date_locale_now from './builtins/date_locale_now';
import date_now from './builtins/date_now';
import date_utc from './builtins/date_utc';
import json_parse from './builtins/json_parse';
import json_stringify from './builtins/json_stringify';
import len from './builtins/len';
import math_abs from './builtins/math_abs';
import math_ceil from './builtins/math_ceil';
import math_floor from './builtins/math_floor';
import math_log from './builtins/math_log';
import math_round from './builtins/math_round';
import math_sqrt from './builtins/math_sqrt';
import math_pow from './builtins/math_pow';
import math_sin from './builtins/math_sin';
import math_cos from './builtins/math_cos';
import math_tan from './builtins/math_tan';
import math_trunc from './builtins/math_trunc';
import math_random from './builtins/math_random';
import number from './builtins/number';
import put from './builtins/put';
import puts from './builtins/puts';
import string from './builtins/string';
import string_contains from './builtins/string_contains';
import string_concat from './builtins/string_concat';
import string_repeat from './builtins/string_repeat';
import string_slice from './builtins/string_slice';
import string_replace from './builtins/string_replace';
import string_split from './builtins/string_split';
import string_trim from './builtins/string_trim';
import string_starts_with from './builtins/string_starts_with';
import string_ends_with from './builtins/string_ends_with';
import string_index_of from './builtins/string_index_of';
import string_reverse from './builtins/string_reverse';
import string_lowercase from './builtins/string_lowercase';
import string_uppercase from './builtins/string_uppercase';
import string_substr from './builtins/string_substr';
import string_substring from './builtins/string_substring';

var builtins: { [s: string]: Builtin } = {
  array_first,
  array_last,
  array_len,
  array_push,
  array_rest,
  date_iso,
  date_locale_now,
  date_locale,
  date_now,
  date_utc,
  json_parse,
  json_stringify,
  len,
  math_abs,
  math_ceil,
  math_floor,
  math_log,
  math_round,
  math_sqrt,
  math_pow,
  math_sin,
  math_cos,
  math_tan,
  math_trunc,
  math_random,
  number,
  put,
  puts,
  string,
  string_contains,
  string_concat,
  string_includes: string_contains, // alias
  string_repeat,
  string_slice,
  string_replace,
  string_split,
  string_trim,
  string_starts_with,
  string_ends_with,
  string_index_of,
  string_reverse,
  string_lowercase,
  string_uppercase,
  string_substr,
  string_substring,
};

export default builtins;
