import { Builtin } from '../object/object';

import array_concat from './builtins/array_concat';
import array_filter from './builtins/array_filter';
import array_find from './builtins/array_find';
import array_first from './builtins/array_first';
import array_flat from './builtins/array_flat';
import array_includes from './builtins/array_includes';
import array_join from './builtins/array_join';
import array_last from './builtins/array_last';
import array_len from './builtins/array_len';
import array_map from './builtins/array_map';
import array_max from './builtins/array_max';
import array_min from './builtins/array_min';
import array_pop from './builtins/array_pop';
import array_push from './builtins/array_push';
import array_reduce from './builtins/array_reduce';
import array_rest from './builtins/array_rest';
import array_reverse from './builtins/array_reverse';
import array_shift from './builtins/array_shift';
import array_slice from './builtins/array_slice';
import array_sort from './builtins/array_sort';
import array_unshift from './builtins/array_unshift';
import date_iso from './builtins/date_iso';
import date_locale from './builtins/date_locale';
import date_locale_now from './builtins/date_locale_now';
import date_now from './builtins/date_now';
import date_utc from './builtins/date_utc';
import hash_contains_key from './builtins/hash_contains_key';
import hash_keys from './builtins/hash_keys';
import hash_remove from './builtins/hash_remove';
import hash_values from './builtins/hash_values';
import json_parse from './builtins/json_parse';
import json_stringify from './builtins/json_stringify';
import len from './builtins/len';
import math_abs from './builtins/math_abs';
import math_ceil from './builtins/math_ceil';
import math_cos from './builtins/math_cos';
import math_floor from './builtins/math_floor';
import math_log from './builtins/math_log';
import math_pow from './builtins/math_pow';
import math_random from './builtins/math_random';
import math_round from './builtins/math_round';
import math_sin from './builtins/math_sin';
import math_sqrt from './builtins/math_sqrt';
import math_tan from './builtins/math_tan';
import math_trunc from './builtins/math_trunc';
import number from './builtins/number';
import print from './builtins/print';
import regex_match from './builtins/regex_match';
import regex_replace from './builtins/regex_replace';
import regex_search from './builtins/regex_search';
import regex_split from './builtins/regex_split';
import regex_test from './builtins/regex_test';
import sprint from './builtins/sprint';
import sprintf from './builtins/sprintf';
import string from './builtins/string';
import string_concat from './builtins/string_concat';
import string_contains from './builtins/string_contains';
import string_ends_with from './builtins/string_ends_with';
import string_format from './builtins/string_format';
import string_index_of from './builtins/string_index_of';
import string_len from './builtins/string_len';
import string_lowercase from './builtins/string_lowercase';
import string_repeat from './builtins/string_repeat';
import string_replace from './builtins/string_replace';
import string_reverse from './builtins/string_reverse';
import string_slice from './builtins/string_slice';
import string_split from './builtins/string_split';
import string_starts_with from './builtins/string_starts_with';
import string_substr from './builtins/string_substr';
import string_substring from './builtins/string_substring';
import string_trim from './builtins/string_trim';
import string_uppercase from './builtins/string_uppercase';

var builtins: { [s: string]: Builtin } = {
  array_concat,
  array_filter,
  array_find,
  array_first,
  array_flat,
  array_includes,
  array_join,
  array_last,
  array_len,
  array_map,
  array_max,
  array_min,
  array_pop,
  array_push,
  array_reduce,
  array_rest,
  array_reverse,
  array_shift,
  array_slice,
  array_sort,
  array_unshift,
  date_iso,
  date_locale_now,
  date_locale,
  date_now,
  date_utc,
  hash_contains_key,
  hash_keys,
  hash_remove,
  hash_values,
  json_parse,
  json_stringify,
  len,
  math_abs,
  math_ceil,
  math_cos,
  math_floor,
  math_log,
  math_pow,
  math_random,
  math_round,
  math_sin,
  math_sqrt,
  math_tan,
  math_trunc,
  number,
  print,
  regex_match,
  regex_replace,
  regex_search,
  regex_split,
  regex_test,
  sprint,
  sprintf,
  string_concat,
  string_contains,
  string_ends_with,
  string_format,
  string_includes: string_contains, // alias
  string_index_of,
  string_len,
  string_lowercase,
  string_repeat,
  string_replace,
  string_reverse,
  string_slice,
  string_split,
  string_starts_with,
  string_substr,
  string_substring,
  string_trim,
  string_uppercase,
  string,
};

export default builtins;
