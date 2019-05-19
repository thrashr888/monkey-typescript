import { Builtin } from '../object/object';

import array_first from './builtins/array_first';
import array_last from './builtins/array_last';
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
import math_random from './builtins/math_random';
import number from './builtins/number';
import put from './builtins/put';
import puts from './builtins/puts';
import string from './builtins/string';

var builtins: { [s: string]: Builtin } = {
  array_first,
  array_last,
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
  math_random,
  number,
  put,
  puts,
  string,
};

export default builtins;
