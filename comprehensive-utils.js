/**
 * ============================================================================
 * Comprehensive JavaScript Utility Library
 * ============================================================================
 * 
 * A production-ready collection of utility functions covering:
 * - Mathematical operations and number theory
 * - String manipulation and text processing
 * - Date and time utilities
 * - Array and object operations
 * - Data structure implementations
 * - Async and promise utilities
 * - Functional programming helpers
 * - Validation and sanitization
 * - Cryptographic helpers
 * - Color and format converters
 * 
 * @version 1.0.0
 * @license MIT
 */

'use strict';

// ============================================================================
// SECTION 1: MATHEMATICAL UTILITIES
// ============================================================================

/**
 * Mathematical utility namespace containing number theory,
 * statistical, and computational geometry functions.
 */
const MathUtils = {
  /**
   * Calculates the greatest common divisor (GCD) of two integers
   * using the Euclidean algorithm. Time complexity: O(log(min(a,b)))
   * 
   * @param {number} a - First integer
   * @param {number} b - Second integer
   * @returns {number} The greatest common divisor
   * @example
   * MathUtils.gcd(48, 18); // returns 6
   */
  gcd(a, b) {
    // Ensure we're working with absolute values
    a = Math.abs(a);
    b = Math.abs(b);
    
    // Euclidean algorithm: repeatedly replace the larger number
    // with the remainder of division until remainder is 0
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  },

  /**
   * Calculates the least common multiple (LCM) of two integers.
   * Uses the relationship: lcm(a,b) = |a * b| / gcd(a,b)
   * 
   * @param {number} a - First integer
   * @param {number} b - Second integer
   * @returns {number} The least common multiple
   */
  lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / this.gcd(a, b);
  },

  /**
   * Checks if a number is prime using trial division up to square root.
   * Optimized by checking 2 separately, then only odd numbers.
   * 
   * @param {number} n - Number to test for primality
   * @returns {boolean} True if n is prime
   */
  isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    
    // Only need to check up to square root of n
    const limit = Math.sqrt(n);
    for (let i = 3; i <= limit; i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  },

  /**
   * Generates all prime numbers up to n using the Sieve of Eratosthenes.
   * Classic algorithm with O(n log log n) time complexity.
   * 
   * @param {number} n - Upper bound (exclusive)
   * @returns {number[]} Array of prime numbers less than n
   */
  sieveOfEratosthenes(n) {
    // Initialize boolean array where index represents the number
    const isPrime = new Array(n).fill(true);
    isPrime[0] = isPrime[1] = false;
    
    // Mark multiples of each prime starting from 2
    for (let i = 2; i * i < n; i++) {
      if (isPrime[i]) {
        // Start marking from i*i since smaller multiples already marked
        for (let j = i * i; j < n; j += i) {
          isPrime[j] = false;
        }
      }
    }
    
    // Collect all primes into result array
    const primes = [];
    for (let i = 2; i < n; i++) {
      if (isPrime[i]) primes.push(i);
    }
    return primes;
  },

  /**
   * Calculates the factorial of n (n!).
   * Uses iterative approach to avoid stack overflow.
   * 
   * @param {number} n - Non-negative integer
   * @returns {bigint} Factorial of n
   */
  factorial(n) {
    if (n < 0) throw new Error('Factorial not defined for negative numbers');
    let result = 1n;
    for (let i = 2n; i <= BigInt(n); i++) {
      result *= i;
    }
    return result;
  },

  /**
   * Calculates n-th Fibonacci number using fast doubling method.
   * Time complexity: O(log n), much faster than naive recursive approach.
   * 
   * @param {number} n - Index in Fibonacci sequence
   * @returns {bigint} The n-th Fibonacci number
   */
  fibonacci(n) {
    // Fast doubling: F(2n) = F(n) * (2*F(n+1) - F(n))
    //               F(2n+1) = F(n+1)^2 + F(n)^2
    function fastDoubling(k) {
      if (k === 0) return [0n, 1n];
      const [a, b] = fastDoubling(Math.floor(k / 2));
      const c = a * (2n * b - a);
      const d = a * a + b * b;
      if (k % 2 === 0) {
        return [c, d];
      } else {
        return [d, c + d];
      }
    }
    return fastDoubling(n)[0];
  },

  /**
   * Linear interpolation between two values.
   * 
   * @param {number} start - Starting value
   * @param {number} end - Ending value
   * @param {number} t - Interpolation factor (0 to 1)
   * @returns {number} Interpolated value
   */
  lerp(start, end, t) {
    return start + (end - start) * t;
  },

  /**
   * Smooth step interpolation (cubic Hermite interpolation).
   * Provides smooth acceleration and deceleration.
   * 
   * @param {number} t - Input value (0 to 1)
   * @returns {number} Smoothly interpolated value
   */
  smoothStep(t) {
    // Clamp t to [0, 1] range
    t = Math.max(0, Math.min(1, t));
    // Apply cubic smoothing: 3t^2 - 2t^3
    return t * t * (3 - 2 * t);
  },

  /**
   * Generates a random integer in the inclusive range [min, max].
   * 
   * @param {number} min - Minimum value (inclusive)
   * @param {number} max - Maximum value (inclusive)
   * @returns {number} Random integer in range
   */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Generates a random number from a normal (Gaussian) distribution
   * using the Box-Muller transform.
   * 
   * @param {number} mean - Mean of distribution
   * @param {number} stdDev - Standard deviation
   * @returns {number} Random normally distributed number
   */
  randomGaussian(mean = 0, stdDev = 1) {
    // Box-Muller transform converts uniform random to normal
    const u1 = 1 - Math.random(); // Avoid log(0)
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stdDev + mean;
  },

  /**
   * Clamps a number within an inclusive range.
   * 
   * @param {number} value - Value to clamp
   * @param {number} min - Minimum bound
   * @param {number} max - Maximum bound
   * @returns {number} Clamped value
   */
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  /**
   * Maps a value from one range to another.
   * 
   * @param {number} value - Input value
   * @param {number} inMin - Input range minimum
   * @param {number} inMax - Input range maximum
   * @param {number} outMin - Output range minimum
   * @param {number} outMax - Output range maximum
   * @returns {number} Mapped value
   */
  mapRange(value, inMin, inMax, outMin, outMax) {
    const ratio = (value - inMin) / (inMax - inMin);
    return outMin + ratio * (outMax - outMin);
  },

  /**
   * Calculates the median of an array of numbers.
   * Sorts array and finds middle value (or average of two middle values).
   * 
   * @param {number[]} arr - Array of numbers
   * @returns {number} Median value
   */
  median(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  },

  /**
   * Calculates standard deviation of an array.
   * Uses population standard deviation formula.
   * 
   * @param {number[]} arr - Array of numbers
   * @returns {number} Standard deviation
   */
  standardDeviation(arr) {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
    return Math.sqrt(variance);
  }
};

// ============================================================================
// SECTION 2: STRING UTILITIES
// ============================================================================

/**
 * String manipulation namespace with text processing,
 * formatting, and parsing utilities.
 */
const StringUtils = {
  /**
   * Converts a string to camelCase format.
   * Removes underscores/hyphens and capitalizes following letters.
   * 
   * @param {string} str - Input string
   * @returns {string} camelCase string
   * @example
   * StringUtils.toCamelCase('hello_world'); // 'helloWorld'
   */
  toCamelCase(str) {
    return str
      .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
      .replace(/^[A-Z]/, char => char.toLowerCase());
  },

  /**
   * Converts a string to PascalCase format.
   * Like camelCase but first letter is capitalized.
   * 
   * @param {string} str - Input string
   * @returns {string} PascalCase string
   */
  toPascalCase(str) {
    const camel = this.toCamelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  },

  /**
   * Converts a string to kebab-case format.
   * Inserts hyphens between words, all lowercase.
   * 
   * @param {string} str - Input string
   * @returns {string} kebab-case string
   */
  toKebabCase(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  },

  /**
   * Converts a string to snake_case format.
   * Inserts underscores between words, all lowercase.
   * 
   * @param {string} str - Input string
   * @returns {string} snake_case string
   */
  toSnakeCase(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toLowerCase();
  },

  /**
   * Truncates a string to a specified length with ellipsis.
   * Respects word boundaries if possible.
   * 
   * @param {string} str - String to truncate
   * @param {number} maxLength - Maximum length including ellipsis
   * @param {string} [ellipsis='...'] - Ellipsis string
   * @returns {string} Truncated string
   */
  truncate(str, maxLength, ellipsis = '...') {
    if (str.length <= maxLength) return str;
    const truncatedLength = maxLength - ellipsis.length;
    return str.slice(0, truncatedLength) + ellipsis;
  },

  /**
   * Capitalizes the first letter of each word in a string.
   * 
   * @param {string} str - Input string
   * @returns {string} Title-cased string
   */
  toTitleCase(str) {
    return str.replace(/\w\S*/g, txt => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  /**
   * Removes all whitespace from a string.
   * 
   * @param {string} str - Input string
   * @returns {string} String without whitespace
   */
  removeWhitespace(str) {
    return str.replace(/\s+/g, '');
  },

  /**
   * Generates a slug from a string for URL usage.
   * Removes special chars, converts spaces to hyphens, lowercase.
   * 
   * @param {string} str - Input string
   * @returns {string} URL-friendly slug
   */
  slugify(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  /**
   * Escapes HTML special characters in a string.
   * Prevents XSS attacks when inserting user content.
   * 
   * @param {string} str - String with potential HTML
   * @returns {string} Escaped string safe for HTML insertion
   */
  escapeHtml(str) {
    const htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return str.replace(/[&<>"']/g, char => htmlEscapes[char]);
  },

  /**
   * Reverses a string, handling Unicode surrogate pairs correctly.
   * 
   * @param {string} str - Input string
   * @returns {string} Reversed string
   */
  reverse(str) {
    // Use Array.from to properly handle Unicode
    return Array.from(str).reverse().join('');
  },

  /**
   * Counts occurrences of a substring in a string.
   * 
   * @param {string} str - Haystack string
   * @param {string} substring - Needle to search for
   * @returns {number} Number of occurrences
   */
  countOccurrences(str, substring) {
    if (substring.length === 0) return 0;
    let count = 0;
    let pos = str.indexOf(substring);
    while (pos !== -1) {
      count++;
      pos = str.indexOf(substring, pos + substring.length);
    }
    return count;
  },

  /**
   * Checks if a string is a palindrome.
   * Ignores case, spaces, and punctuation.
   * 
   * @param {string} str - String to test
   * @returns {boolean} True if palindrome
   */
  isPalindrome(str) {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === this.reverse(cleaned);
  },

  /**
   * Generates a random alphanumeric string of specified length.
   * Uses crypto.getRandomValues when available, falls back to Math.random.
   * 
   * @param {number} length - Length of string to generate
   * @returns {string} Random alphanumeric string
   */
  randomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    // Use crypto API if available for better randomness
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const randomValues = new Uint32Array(length);
      crypto.getRandomValues(randomValues);
      for (let i = 0; i < length; i++) {
        result += chars[randomValues[i] % chars.length];
      }
    } else {
      for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    return result;
  },

  /**
   * Extracts all URLs from a string using regex.
   * 
   * @param {string} str - String to search
   * @returns {string[]} Array of found URLs
   */
  extractUrls(str) {
    const urlRegex = /(https?:\/\/[^\s"<>{}|\^`\[\]]+)/g;
    return str.match(urlRegex) || [];
  },

  /**
   * Masks a string showing only last N characters.
   * Useful for credit cards, phone numbers, etc.
   * 
   * @param {string} str - String to mask
   * @param {number} visibleCount - Number of characters to show at end
   * @param {string} [maskChar='*'] - Character to use for masking
   * @returns {string} Masked string
   */
  mask(str, visibleCount, maskChar = '*') {
    if (str.length <= visibleCount) return str;
    return maskChar.repeat(str.length - visibleCount) + str.slice(-visibleCount);
  },

  /**
   * Pads a string to a specified length.
   * 
   * @param {string} str - String to pad
   * @param {number} length - Target length
   * @param {string} [padChar=' '] - Character to pad with
   * @param {string} [side='left'] - Side to pad on ('left' or 'right')
   * @returns {string} Padded string
   */
  pad(str, length, padChar = ' ', side = 'left') {
    const padLength = Math.max(0, length - str.length);
    const padding = padChar.repeat(padLength);
    return side === 'left' ? padding + str : str + padding;
  }
};

// ============================================================================
// SECTION 3: DATE AND TIME UTILITIES
// ============================================================================

/**
 * Date manipulation namespace with formatting, parsing,
 * and relative time utilities.
 */
const DateUtils = {
  /**
   * Array of full month names for display.
   * Index 0 = January, Index 11 = December
   */
  MONTH_NAMES: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],

  /**
   * Array of abbreviated month names.
   */
  MONTH_NAMES_SHORT: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ],

  /**
   * Array of full day names.
   * Index 0 = Sunday, Index 6 = Saturday
   */
  DAY_NAMES: [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'
  ],

  /**
   * Array of abbreviated day names.
   */
  DAY_NAMES_SHORT: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

  /**
   * Formats a Date object according to a format string.
   * Supports: YYYY, MM, DD, HH, mm, ss, and other common tokens.
   * 
   * @param {Date} date - Date to format
   * @param {string} format - Format string with tokens
   * @returns {string} Formatted date string
   * @example
   * DateUtils.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
   */
  format(date, format) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ms = date.getMilliseconds();

    // Helper to pad numbers with leading zeros
    const pad = (n, len = 2) => String(n).padStart(len, '0');

    return format
      .replace('YYYY', String(year))
      .replace('YY', String(year).slice(-2))
      .replace('MM', pad(month))
      .replace('M', String(month))
      .replace('DD', pad(day))
      .replace('D', String(day))
      .replace('HH', pad(hours))
      .replace('H', String(hours))
      .replace('mm', pad(minutes))
      .replace('m', String(minutes))
      .replace('ss', pad(seconds))
      .replace('s', String(seconds))
      .replace('SSS', pad(ms, 3))
      .replace('SS', pad(Math.floor(ms / 10), 2));
  },

  /**
   * Parses a date string in ISO format (YYYY-MM-DD).
   * Returns Date object or null if invalid.
   * 
   * @param {string} str - Date string to parse
   * @returns {Date|null} Parsed Date or null
   */
  parseISODate(str) {
    const match = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;
    const [_, year, month, day] = match;
    const date = new Date(year, month - 1, day);
    // Validate the parsed date is real (not e.g. Feb 30)
    if (date.getMonth() !== month - 1) return null;
    return date;
  },

  /**
   * Returns a relative time string (e.g., "2 hours ago").
   * Compares given date to current time.
   * 
   * @param {Date} date - Date to describe relatively
   * @returns {string} Human-readable relative time
   */
  timeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffSec < 10) return 'just now';
    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffMin < 2) return 'a minute ago';
    if (diffMin < 60) return `${diffMin} minutes ago`;
    if (diffHour < 2) return 'an hour ago';
    if (diffHour < 24) return `${diffHour} hours ago`;
    if (diffDay < 2) return 'yesterday';
    if (diffDay < 30) return `${diffDay} days ago`;
    if (diffMonth < 12) return `${diffMonth} months ago`;
    if (diffYear < 2) return 'a year ago';
    return `${diffYear} years ago`;
  },

  /**
   * Adds a specified amount of time to a Date object.
   * 
   * @param {Date} date - Starting date
   * @param {number} amount - Amount to add
   * @param {string} unit - Unit: 'ms', 'seconds', 'minutes', 'hours', 'days', 'months', 'years'
   * @returns {Date} New Date with time added
   */
  addTime(date, amount, unit) {
    const result = new Date(date);
    switch (unit) {
      case 'ms': result.setMilliseconds(result.getMilliseconds() + amount); break;
      case 'seconds': result.setSeconds(result.getSeconds() + amount); break;
      case 'minutes': result.setMinutes(result.getMinutes() + amount); break;
      case 'hours': result.setHours(result.getHours() + amount); break;
      case 'days': result.setDate(result.getDate() + amount); break;
      case 'months': result.setMonth(result.getMonth() + amount); break;
      case 'years': result.setFullYear(result.getFullYear() + amount); break;
      default: throw new Error(`Unknown time unit: ${unit}`);
    }
    return result;
  },

  /**
   * Checks if a year is a leap year.
   * Leap years are divisible by 4, except century years not divisible by 400.
   * 
   * @param {number} year - Year to check
   * @returns {boolean} True if leap year
   */
  isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  },

  /**
   * Gets the number of days in a month.
   * Accounts for leap years in February.
   * 
   * @param {number} year - Year
   * @param {number} month - Month (1-12)
   * @returns {number} Number of days in month
   */
  daysInMonth(year, month) {
    // Month 0 is January in JS, so we pass month to get next month and subtract
    return new Date(year, month, 0).getDate();
  },

  /**
   * Gets the start of a time unit for a date.
   * e.g., startOf(date, 'day') returns midnight of that day.
   * 
   * @param {Date} date - Input date
   * @param {string} unit - Unit: 'day', 'month', 'year'
   * @returns {Date} Date at start of unit
   */
  startOf(date, unit) {
    const result = new Date(date);
    switch (unit) {
      case 'day':
        result.setHours(0, 0, 0, 0);
        break;
      case 'month':
        result.setDate(1);
        result.setHours(0, 0, 0, 0);
        break;
      case 'year':
        result.setMonth(0, 1);
        result.setHours(0, 0, 0, 0);
        break;
    }
    return result;
  },

  /**
   * Checks if two dates are on the same calendar day.
   * 
   * @param {Date} a - First date
   * @param {Date} b - Second date
   * @returns {boolean} True if same day
   */
  isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  },

  /**
   * Generates an array of dates between start and end (inclusive).
   * 
   * @param {Date} start - Start date
   * @param {Date} end - End date
   * @returns {Date[]} Array of dates in range
   */
  dateRange(start, end) {
    const dates = [];
    let current = new Date(start);
    const endTime = end.getTime();
    while (current.getTime() <= endTime) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  },

  /**
   * Gets ISO week number for a date.
   * ISO weeks start on Monday. Week 1 contains first Thursday of year.
   * 
   * @param {Date} date - Date to get week for
   * @returns {number} ISO week number (1-53)
   */
  getISOWeek(date) {
    const tmp = new Date(date);
    tmp.setHours(0, 0, 0, 0);
    // Thursday in current week sets the "ISO week year"
    tmp.setDate(tmp.getDate() + 4 - (tmp.getDay() || 7));
    const yearStart = new Date(tmp.getFullYear(), 0, 1);
    return Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
  },

  /**
   * Formats a duration in milliseconds to human-readable string.
   * 
   * @param {number} ms - Duration in milliseconds
   * @returns {string} Formatted duration like "2h 30m 15s"
   */
  formatDuration(ms) {
    if (ms < 0) ms = -ms;
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
    
    return parts.join(' ');
  }
};

// ============================================================================
// SECTION 4: ARRAY AND OBJECT UTILITIES
// ============================================================================

/**
 * Collection manipulation namespace with array chunking,
 * flattening, object merging, and deep operations.
 */
const CollectionUtils = {
  /**
   * Splits an array into chunks of specified size.
   * Last chunk may be smaller if array doesn't divide evenly.
   * 
   * @param {Array} arr - Array to chunk
   * @param {number} size - Chunk size
   * @returns {Array[]} Array of chunks
   */
  chunk(arr, size) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  },

  /**
   * Flattens a nested array to specified depth.
   * Depth of Infinity flattens completely.
   * 
   * @param {Array} arr - Array to flatten
   * @param {number} [depth=1] - Depth to flatten
   * @returns {Array} Flattened array
   */
  flatten(arr, depth = 1) {
    if (depth === 0) return arr;
    return arr.reduce((acc, val) => {
      if (Array.isArray(val) && depth > 0) {
        return acc.concat(this.flatten(val, depth - 1));
      }
      return acc.concat(val);
    }, []);
  },

  /**
   * Removes duplicate values from an array.
   * Uses Set for primitive types, comparator for objects.
   * 
   * @param {Array} arr - Array to deduplicate
   * @param {Function} [keyFn] - Function to extract comparison key
   * @returns {Array} Array with duplicates removed
   */
  unique(arr, keyFn = x => x) {
    const seen = new Set();
    return arr.filter(item => {
      const key = keyFn(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  },

  /**
   * Groups array elements by a key function.
   * Similar to SQL GROUP BY operation.
   * 
   * @param {Array} arr - Array to group
   * @param {Function} keyFn - Function returning group key
   * @returns {Object} Object with keys mapping to arrays of values
   */
  groupBy(arr, keyFn) {
    return arr.reduce((groups, item) => {
      const key = keyFn(item);
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
      return groups;
    }, {});
  },

  /**
   * Sorts an array by multiple criteria with specified directions.
   * 
   * @param {Array} arr - Array to sort
   * @param {Array<{key: Function, dir: 'asc'|'desc'}>} criteria - Sort criteria
   * @returns {Array} Sorted array (new array, original unchanged)
   */
  orderBy(arr, criteria) {
    return [...arr].sort((a, b) => {
      for (const { key, dir } of criteria) {
        const valA = key(a);
        const valB = key(b);
        if (valA < valB) return dir === 'desc' ? 1 : -1;
        if (valA > valB) return dir === 'desc' ? -1 : 1;
      }
      return 0;
    });
  },

  /**
   * Partitions array into two groups based on predicate.
   * 
   * @param {Array} arr - Array to partition
   * @param {Function} predicate - Truthy returns go to first group
   * @returns {[Array, Array]} Tuple of [pass, fail] arrays
   */
  partition(arr, predicate) {
    const pass = [];
    const fail = [];
    for (const item of arr) {
      if (predicate(item)) {
        pass.push(item);
      } else {
        fail.push(item);
      }
    }
    return [pass, fail];
  },

  /**
   * Creates an object from an array of key-value pairs.
   * 
   * @param {Array<[string, any]>} pairs - Array of [key, value] tuples
   * @returns {Object} Created object
   */
  fromPairs(pairs) {
    const result = {};
    for (const [key, value] of pairs) {
      result[key] = value;
    }
    return result;
  },

  /**
   * Picks specified keys from an object.
   * Creates new object with only the selected properties.
   * 
   * @param {Object} obj - Source object
   * @param {string[]} keys - Keys to pick
   * @returns {Object} Object with picked keys
   */
  pick(obj, keys) {
    const result = {};
    for (const key of keys) {
      if (key in obj) result[key] = obj[key];
    }
    return result;
  },

  /**
   * Omits specified keys from an object.
   * Creates new object without the selected properties.
   * 
   * @param {Object} obj - Source object
   * @param {string[]} keys - Keys to omit
   * @returns {Object} Object with keys omitted
   */
  omit(obj, keys) {
    const keySet = new Set(keys);
    const result = {};
    for (const key in obj) {
      if (!keySet.has(key)) result[key] = obj[key];
    }
    return result;
  },

  /**
   * Deeply merges multiple objects.
   * Arrays are concatenated, objects recursively merged.
   * 
   * @param {...Object} objects - Objects to merge
   * @returns {Object} Deeply merged object
   */
  deepMerge(...objects) {
    const isObject = (item) => item && typeof item === 'object' && !Array.isArray(item);
    
    return objects.reduce((acc, obj) => {
      if (!obj) return acc;
      
      Object.keys(obj).forEach(key => {
        const accValue = acc[key];
        const objValue = obj[key];
        
        if (Array.isArray(accValue) && Array.isArray(objValue)) {
          acc[key] = accValue.concat(objValue);
        } else if (isObject(accValue) && isObject(objValue)) {
          acc[key] = this.deepMerge(accValue, objValue);
        } else {
          acc[key] = objValue;
        }
      });
      
      return acc;
    }, {});
  },

  /**
   * Creates a deep clone of an object or array.
   * Handles circular references by tracking visited objects.
   * 
   * @param {any} obj - Object to clone
   * @param {WeakMap} [visited] - Internal cache for circular ref handling
   * @returns {any} Deep clone of input
   */
  deepClone(obj, visited = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);
    if (obj instanceof Map) {
      const clone = new Map();
      visited.set(obj, clone);
      obj.forEach((value, key) => {
        clone.set(
          this.deepClone(key, visited),
          this.deepClone(value, visited)
        );
      });
      return clone;
    }
    if (obj instanceof Set) {
      const clone = new Set();
      visited.set(obj, clone);
      obj.forEach(value => {
        clone.add(this.deepClone(value, visited));
      });
      return clone;
    }
    if (visited.has(obj)) return visited.get(obj);
    
    const clone = Array.isArray(obj) ? [] : {};
    visited.set(obj, clone);
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clone[key] = this.deepClone(obj[key], visited);
      }
    }
    return clone;
  },

  /**
   * Gets a nested property from an object using dot notation.
   * Safe navigation - returns undefined instead of throwing.
   * 
   * @param {Object} obj - Object to access
   * @param {string} path - Dot-separated path like 'a.b.c'
   * @param {any} [defaultValue] - Value to return if path not found
   * @returns {any} Value at path or defaultValue
   */
  get(obj, path, defaultValue) {
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
      if (current === null || current === undefined || !(key in current)) {
        return defaultValue;
      }
      current = current[key];
    }
    return current;
  },

  /**
   * Sets a nested property on an object using dot notation.
   * Creates intermediate objects if they don't exist.
   * 
   * @param {Object} obj - Object to modify
   * @param {string} path - Dot-separated path
   * @param {any} value - Value to set
   * @returns {Object} Modified object (same reference)
   */
  set(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    current[keys[keys.length - 1]] = value;
    return obj;
  },

  /**
   * Inverts an object: keys become values, values become keys.
   * If values are not unique, last key wins.
   * 
   * @param {Object} obj - Object to invert
   * @returns {Object} Inverted object
   */
  invert(obj) {
    const result = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[obj[key]] = key;
      }
    }
    return result;
  },

  /**
   * Filters an object's entries by predicate on values.
   * 
   * @param {Object} obj - Object to filter
   * @param {Function} predicate - (value, key) => boolean
   * @returns {Object} Filtered object with passing entries
   */
  filterObject(obj, predicate) {
    const result = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && predicate(obj[key], key)) {
        result[key] = obj[key];
      }
    }
    return result;
  },

  /**
   * Maps an object's values through a transform function.
   * Keeps original keys, transforms values.
   * 
   * @param {Object} obj - Object to map
   * @param {Function} transform - (value, key) => newValue
   * @returns {Object} Object with transformed values
   */
  mapValues(obj, transform) {
    const result = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = transform(obj[key], key);
      }
    }
    return result;
  }
};

// ============================================================================
// SECTION 5: DATA STRUCTURES
// ============================================================================

/**
 * Simple hash map implementation with chaining for collision resolution.
 * Provides O(1) average case for insert, delete, and lookup.
 */
class HashMap {
  /**
   * Creates a new HashMap with specified initial capacity.
   * Automatically grows when load factor exceeds 0.75.
   * 
   * @param {number} [initialCapacity=16] - Initial bucket count
   */
  constructor(initialCapacity = 16) {
    this.capacity = initialCapacity;
    this.size = 0;
    this.buckets = new Array(this.capacity).fill(null).map(() => []);
    this.loadFactor = 0.75;
  }

  /**
   * Computes hash code for a key string.
   * Uses djb2 algorithm for good distribution.
   * 
   * @param {string} key - Key to hash
   * @returns {number} Hash code
   */
  _hash(key) {
    let hash = 5381;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) + hash) + key.charCodeAt(i); // hash * 33 + char
    }
    return Math.abs(hash) % this.capacity;
  }

  /**
   * Grows the hash table when load factor exceeded.
   * Doubles capacity and rehashes all entries.
   */
  _resize() {
    const oldBuckets = this.buckets;
    this.capacity *= 2;
    this.size = 0;
    this.buckets = new Array(this.capacity).fill(null).map(() => []);
    
    // Reinsert all entries into new buckets
    for (const bucket of oldBuckets) {
      for (const [key, value] of bucket) {
        this.set(key, value);
      }
    }
  }

  /**
   * Inserts or updates a key-value pair.
   * 
   * @param {string} key - Key to set
   * @param {any} value - Value to store
   */
  set(key, value) {
    const index = this._hash(key);
    const bucket = this.buckets[index];
    
    // Check if key already exists and update
    for (const entry of bucket) {
      if (entry[0] === key) {
        entry[1] = value;
        return;
      }
    }
    
    // Add new entry
    bucket.push([key, value]);
    this.size++;
    
    // Grow if load factor exceeded
    if (this.size / this.capacity > this.loadFactor) {
      this._resize();
    }
  }

  /**
   * Retrieves value by key.
   * 
   * @param {string} key - Key to look up
   * @returns {any|undefined} Value or undefined if not found
   */
  get(key) {
    const index = this._hash(key);
    const bucket = this.buckets[index];
    
    for (const entry of bucket) {
      if (entry[0] === key) {
        return entry[1];
      }
    }
    return undefined;
  }

  /**
   * Checks if key exists in map.
   * 
   * @param {string} key - Key to check
   * @returns {boolean} True if key exists
   */
  has(key) {
    return this.get(key) !== undefined;
  }

  /**
   * Removes a key-value pair from the map.
   * 
   * @param {string} key - Key to remove
   * @returns {boolean} True if key was present and removed
   */
  delete(key) {
    const index = this._hash(key);
    const bucket = this.buckets[index];
    
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket.splice(i, 1);
        this.size--;
        return true;
      }
    }
    return false;
  }

  /**
   * Returns all keys in the map.
   * 
   * @returns {string[]} Array of keys
   */
  keys() {
    const result = [];
    for (const bucket of this.buckets) {
      for (const [key] of bucket) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * Returns all values in the map.
   * 
   * @returns {any[]} Array of values
   */
  values() {
    const result = [];
    for (const bucket of this.buckets) {
      for (const [, value] of bucket) {
        result.push(value);
      }
    }
    return result;
  }
}

/**
 * Priority Queue implementation using binary min-heap.
 * Efficiently retrieves the highest (or lowest) priority element.
 */
class PriorityQueue {
  /**
   * Creates a new PriorityQueue.
   * 
   * @param {Function} [compareFn] - Comparison function (a, b) => number
   *   Default is min-heap (smallest first)
   */
  constructor(compareFn = (a, b) => a - b) {
    this.heap = [];
    this.compare = compareFn;
  }

  /**
   * Gets parent index in binary heap array representation.
   */
  _parent(i) { return Math.floor((i - 1) / 2); }
  
  /**
   * Gets left child index.
   */
  _leftChild(i) { return 2 * i + 1; }
  
  /**
   * Gets right child index.
   */
  _rightChild(i) { return 2 * i + 2; }

  /**
   * Swaps two elements in the heap array.
   */
  _swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  /**
   * Moves element up to maintain heap property.
   */
  _heapifyUp(index) {
    let current = index;
    while (current > 0) {
      const parent = this._parent(current);
      if (this.compare(this.heap[current], this.heap[parent]) < 0) {
        this._swap(current, parent);
        current = parent;
      } else {
        break;
      }
    }
  }

  /**
   * Moves element down to maintain heap property.
   */
  _heapifyDown(index) {
    let current = index;
    while (true) {
      let smallest = current;
      const left = this._leftChild(current);
      const right = this._rightChild(current);
      
      if (left < this.heap.length && 
          this.compare(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < this.heap.length && 
          this.compare(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }
      
      if (smallest === current) break;
      this._swap(current, smallest);
      current = smallest;
    }
  }

  /**
   * Adds an element to the queue.
   * Time complexity: O(log n)
   * 
   * @param {any} item - Item to enqueue
   */
  enqueue(item) {
    this.heap.push(item);
    this._heapifyUp(this.heap.length - 1);
  }

  /**
   * Removes and returns the highest priority element.
   * Time complexity: O(log n)
   * 
   * @returns {any|null} Dequeued item or null if empty
   */
  dequeue() {
    if (this.isEmpty()) return null;
    if (this.heap.length === 1) return this.heap.pop();
    
    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._heapifyDown(0);
    return min;
  }

  /**
   * Views the highest priority element without removing it.
   * 
   * @returns {any|null} Front item or null if empty
   */
  peek() {
    return this.isEmpty() ? null : this.heap[0];
  }

  /**
   * Checks if queue is empty.
   * 
   * @returns {boolean} True if empty
   */
  isEmpty() {
    return this.heap.length === 0;
  }

  /**
   * Gets the number of elements in queue.
   * 
   * @returns {number} Queue size
   */
  size() {
    return this.heap.length;
  }
}

// ============================================================================
// SECTION 6: ASYNC UTILITIES
// ============================================================================

/**
 * Asynchronous programming utilities for promises,
 * delays, rate limiting, and concurrency control.
 */
const AsyncUtils = {
  /**
   * Creates a promise that resolves after specified milliseconds.
   * Useful for adding delays in async functions.
   * 
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>} Resolves after delay
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Creates a cancellable promise that rejects if not resolved in time.
   * 
   * @param {Promise} promise - Promise to wrap
   * @param {number} ms - Timeout in milliseconds
   * @param {string} [message='Operation timed out'] - Timeout message
   * @returns {Promise} Resolves with original value or rejects on timeout
   */
  withTimeout(promise, ms, message = 'Operation timed out') {
    const timeoutPromise = new Promise((_, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(message));
      }, ms);
      // Clean up timer if main promise resolves first
      promise.finally(() => clearTimeout(timer));
    });
    return Promise.race([promise, timeoutPromise]);
  },

  /**
   * Retries an async function with exponential backoff.
   * Waits longer between each retry attempt.
   * 
   * @param {Function} fn - Async function to retry
   * @param {Object} [options] - Retry options
   * @param {number} [options.maxRetries=3] - Maximum retry attempts
   * @param {number} [options.delay=1000] - Initial delay in ms
   * @param {number} [options.backoff=2] - Backoff multiplier
   * @returns {Promise} Result of fn or final rejection
   */
  async retry(fn, { maxRetries = 3, delay = 1000, backoff = 2 } = {}) {
    let lastError;
    let currentDelay = delay;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          await this.sleep(currentDelay);
          currentDelay *= backoff;
        }
      }
    }
    throw lastError;
  },

  /**
   * Runs array of promises with limited concurrency.
   * Ensures no more than N promises run simultaneously.
   * 
   * @param {Array<() => Promise>} tasks - Functions returning promises
   * @param {number} concurrency - Maximum concurrent executions
   * @returns {Promise<Array>} Results in original order
   */
  async parallelLimit(tasks, concurrency) {
    const results = new Array(tasks.length);
    let index = 0;
    
    async function worker() {
      while (index < tasks.length) {
        const currentIndex = index++;
        try {
          results[currentIndex] = await tasks[currentIndex]();
        } catch (error) {
          results[currentIndex] = error;
        }
      }
    }
    
    // Start N workers
    const workers = Array(Math.min(concurrency, tasks.length))
      .fill(null)
      .map(() => worker());
    
    await Promise.all(workers);
    return results;
  },

  /**
   * Creates a debounced version of a function.
   * Delays execution until after wait milliseconds of inactivity.
   * 
   * @param {Function} fn - Function to debounce
   * @param {number} wait - Milliseconds to wait
   * @returns {Function} Debounced function
   */
  debounce(fn, wait) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(context, args), wait);
    };
  },

  /**
   * Creates a throttled version of a function.
   * Ensures function is called at most once per wait period.
   * 
   * @param {Function} fn - Function to throttle
   * @param {number} wait - Minimum milliseconds between calls
   * @returns {Function} Throttled function
   */
  throttle(fn, wait) {
    let lastTime = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastTime >= wait) {
        lastTime = now;
        fn.apply(this, args);
      }
    };
  },

  /**
   * Creates a memoized async function.
   * Caches results keyed by JSON-serialized arguments.
   * 
   * @param {Function} fn - Async function to memoize
   * @returns {Function} Memoized function
   */
  memoizeAsync(fn) {
    const cache = new Map();
    return async function (...args) {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = await fn.apply(this, args);
      cache.set(key, result);
      return result;
    };
  },

  /**
   * Creates an async generator from a paginated API.
   * Automatically fetches next pages on demand.
   * 
   * @param {Function} fetchPage - (page, pageSize) => Promise<{items, hasMore}>
   * @param {number} [pageSize=50] - Items per page
   */
  async *paginated(fetchPage, pageSize = 50) {
    let page = 0;
    let hasMore = true;
    
    while (hasMore) {
      const result = await fetchPage(page, pageSize);
      for (const item of result.items) {
        yield item;
      }
      hasMore = result.hasMore;
      page++;
    }
  },

  /**
   * Wraps a callback-style function to return a Promise.
   * Follows Node.js error-first callback convention.
   * 
   * @param {Function} fn - Callback-style function
   * @returns {Function} Promisified function
   */
  promisify(fn) {
    return function (...args) {
      return new Promise((resolve, reject) => {
        fn(...args, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    };
  }
};

// ============================================================================
// SECTION 7: VALIDATION UTILITIES
// ============================================================================

/**
 * Input validation namespace with common format checks
 * and sanitization functions.
 */
const Validate = {
  /**
   * Validates an email address format.
   * Uses RFC 5322 compliant regex (simplified).
   * 
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email format
   */
  isEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  /**
   * Validates a URL string.
   * Supports http, https, ftp protocols.
   * 
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid URL
   */
  isURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validates IPv4 address format.
   * Checks each octet is 0-255.
   * 
   * @param {string} ip - IP address to validate
   * @returns {boolean} True if valid IPv4
   */
  isIPv4(ip) {
    const regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    if (!regex.test(ip)) return false;
    return ip.split('.').every(octet => parseInt(octet, 10) <= 255);
  },

  /**
   * Validates credit card number using Luhn algorithm.
   * Also known as "modulus 10" or "mod 10" algorithm.
   * 
   * @param {string} cardNumber - Credit card number (with or without spaces)
   * @returns {boolean} True if valid card number
   */
  isCreditCard(cardNumber) {
    // Remove spaces and dashes
    const cleaned = cardNumber.replace(/[\s-]/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) return false;
    
    let sum = 0;
    let isEven = false;
    
    // Luhn algorithm: double every second digit from right
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i], 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9; // Equivalent to summing digits
      }
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  },

  /**
   * Validates that a string contains only alphanumeric characters.
   * 
   * @param {string} str - String to test
   * @returns {boolean} True if alphanumeric only
   */
  isAlphanumeric(str) {
    return /^[a-zA-Z0-9]+$/.test(str);
  },

  /**
   * Validates that a value is a valid integer.
   * Optionally checks range.
   * 
   * @param {any} value - Value to test
   * @param {number} [min] - Minimum allowed value
   * @param {number} [max] - Maximum allowed value
   * @returns {boolean} True if valid integer in range
   */
  isInteger(value, min, max) {
    if (!Number.isInteger(value)) return false;
    if (min !== undefined && value < min) return false;
    if (max !== undefined && value > max) return false;
    return true;
  },

  /**
   * Validates password strength.
   * Checks length and character class requirements.
   * 
   * @param {string} password - Password to validate
   * @param {Object} [options] - Validation options
   * @param {number} [options.minLength=8] - Minimum length
   * @param {boolean} [options.requireUppercase=true] - Require uppercase
   * @param {boolean} [options.requireLowercase=true] - Require lowercase
   * @param {boolean} [options.requireNumbers=true] - Require digits
   * @param {boolean} [options.requireSpecial=true] - Require special chars
   * @returns {boolean} True if password meets requirements
   */
  isStrongPassword(password, {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecial = true
  } = {}) {
    if (password.length < minLength) return false;
    if (requireUppercase && !/[A-Z]/.test(password)) return false;
    if (requireLowercase && !/[a-z]/.test(password)) return false;
    if (requireNumbers && !/\d/.test(password)) return false;
    if (requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
    return true;
  },

  /**
   * Sanitizes a string for safe SQL LIKE usage.
   * Escapes wildcard characters % and _
   * 
   * @param {string} str - String to sanitize
   * @returns {string} Escaped string
   */
  escapeLike(str) {
    return str.replace(/[%_\\]/g, '\\$&');
  },

  /**
   * Removes all non-numeric characters from a string.
   * Useful for normalizing phone numbers.
   * 
   * @param {string} str - String to clean
   * @returns {string} String with only digits
   */
  digitsOnly(str) {
    return str.replace(/\D/g, '');
  },

  /**
   * Normalizes a phone number to E.164 format.
   * Removes non-digits and adds + prefix.
   * 
   * @param {string} phone - Phone number to normalize
   * @param {string} [countryCode='+1'] - Default country code
   * @returns {string} Normalized phone number
   */
  normalizePhone(phone, countryCode = '+1') {
    const digits = this.digitsOnly(phone);
    if (digits.startsWith('1') && digits.length === 11) {
      return '+' + digits;
    }
    if (digits.length === 10) {
      return countryCode + digits;
    }
    return '+' + digits;
  }
};

// ============================================================================
// SECTION 8: COLOR AND FORMAT UTILITIES
// ============================================================================

/**
 * Color manipulation namespace with conversion between
 * hex, rgb, hsl, and other color spaces.
 */
const ColorUtils = {
  /**
   * Converts hex color string to RGB object.
   * Supports shorthand (#RGB) and standard (#RRGGBB) formats.
   * 
   * @param {string} hex - Hex color string
   * @returns {{r:number, g:number, b:number}} RGB values 0-255
   */
  hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Expand shorthand (e.g., "abc" -> "aabbcc")
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    
    const bigint = parseInt(hex, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  },

  /**
   * Converts RGB values to hex string.
   * 
   * @param {number} r - Red (0-255)
   * @param {number} g - Green (0-255)
   * @param {number} b - Blue (0-255)
   * @returns {string} Hex color string
   */
  rgbToHex(r, g, b) {
    const toHex = (n) => {
      const hex = MathUtils.clamp(n, 0, 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + toHex(r) + toHex(g) + toHex(b);
  },

  /**
   * Converts RGB to HSL color space.
   * HSL is often more intuitive for color manipulation.
   * 
   * @param {number} r - Red (0-255)
   * @param {number} g - Green (0-255)
   * @param {number} b - Blue (0-255)
   * @returns {{h:number, s:number, l:number}} HSL values
   */
  rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // Achromatic (gray)
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: h * 360, s, l };
  },

  /**
   * Converts HSL to RGB color space.
   * 
   * @param {number} h - Hue (0-360)
   * @param {number} s - Saturation (0-1)
   * @param {number} l - Lightness (0-1)
   * @returns {{r:number, g:number, b:number}} RGB values 0-255
   */
  hslToRgb(h, s, l) {
    h /= 360;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  },

  /**
   * Lightens a color by specified amount.
   * Operates in HSL space for intuitive results.
   * 
   * @param {string} color - Hex color string
   * @param {number} amount - Amount to lighten (0-1)
   * @returns {string} Lightened hex color
   */
  lighten(color, amount) {
    const rgb = this.hexToRgb(color);
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.l = MathUtils.clamp(hsl.l + amount, 0, 1);
    const newRgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
    return this.rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  },

  /**
   * Darkens a color by specified amount.
   * 
   * @param {string} color - Hex color string
   * @param {number} amount - Amount to darken (0-1)
   * @returns {string} Darkened hex color
   */
  darken(color, amount) {
    return this.lighten(color, -amount);
  },

  /**
   * Calculates relative luminance of a color (WCAG formula).
   * Used for determining contrast ratios.
   * 
   * @param {string} color - Hex color string
   * @returns {number} Relative luminance (0-1)
   */
  luminance(color) {
    const rgb = this.hexToRgb(color);
    // Convert to linear RGB
    const toLinear = (c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    const r = toLinear(rgb.r);
    const g = toLinear(rgb.g);
    const b = toLinear(rgb.b);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },

  /**
   * Calculates contrast ratio between two colors (WCAG 2.0).
   * Ratio of 4.5:1 is minimum for normal text, 7:1 for AAA.
   * 
   * @param {string} color1 - First hex color
   * @param {string} color2 - Second hex color
   * @returns {number} Contrast ratio (1-21)
   */
  contrastRatio(color1, color2) {
    const lum1 = this.luminance(color1);
    const lum2 = this.luminance(color2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  },

  /**
   * Determines best text color (black or white) for background.
   * Chooses color with highest contrast ratio.
   * 
   * @param {string} backgroundColor - Background hex color
   * @returns {string} '#000000' or '#ffffff'
   */
  textColorForBackground(backgroundColor) {
    const lum = this.luminance(backgroundColor);
    return lum > 0.5 ? '#000000' : '#ffffff';
  },

  /**
   * Generates a color palette from a base color.
   * Creates monochromatic variations.
   * 
   * @param {string} baseColor - Base hex color
   * @param {number} [count=5] - Number of colors to generate
   * @returns {string[]} Array of hex colors
   */
  generatePalette(baseColor, count = 5) {
    const rgb = this.hexToRgb(baseColor);
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    const palette = [];
    
    for (let i = 0; i < count; i++) {
      const lightness = 0.1 + (0.8 * i / (count - 1));
      const newRgb = this.hslToRgb(hsl.h, hsl.s, lightness);
      palette.push(this.rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
    return palette;
  }
};

// ============================================================================
// SECTION 9: CRYPTOGRAPHIC AND HASHING UTILITIES
// ============================================================================

/**
 * Cryptographic helper namespace with hash functions,
 * HMAC, and secure random generation.
 */
const CryptoUtils = {
  /**
   * Computes SHA-256 hash of a string using Web Crypto API.
   * Returns hex-encoded digest.
   * 
   * @param {string} message - String to hash
   * @returns {Promise<string>} Hex-encoded SHA-256 digest
   */
  async sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Computes a simple non-cryptographic hash for quick lookups.
   * Uses FNV-1a algorithm for speed.
   * 
   * @param {string} str - String to hash
   * @returns {number} 32-bit hash value
   */
  fnv1a(str) {
    let hash = 2166136261; // FNV offset basis
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return hash >>> 0; // Convert to unsigned 32-bit
  },

  /**
   * Generates a UUID v4 (random) string.
   * Uses crypto.getRandomValues for secure randomness.
   * 
   * @returns {string} UUID v4 string
   */
  uuidv4() {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    
    // Set version (4) and variant bits per RFC 4122
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0'));
    return `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`;
  },

  /**
   * Constant-time string comparison to prevent timing attacks.
   * Always compares all characters regardless of early mismatch.
   * 
   * @param {string} a - First string
   * @param {string} b - Second string
   * @returns {boolean} True if strings are equal
   */
  secureCompare(a, b) {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  },

  /**
   * Generates a cryptographically secure random integer.
   * 
   * @param {number} min - Minimum value (inclusive)
   * @param {number} max - Maximum value (inclusive)
   * @returns {number} Secure random integer
   */
  secureRandomInt(min, max) {
    const range = max - min + 1;
    const bytesNeeded = Math.ceil(Math.log2(range) / 8);
    const mask = Math.pow(2, bytesNeeded * 8) - 1;
    
    let value;
    do {
      const bytes = new Uint8Array(bytesNeeded);
      crypto.getRandomValues(bytes);
      value = 0;
      for (let i = 0; i < bytesNeeded; i++) {
        value = (value << 8) | bytes[i];
      }
      value = value & mask;
    } while (value >= range);
    
    return min + value;
  }
};

// ============================================================================
// SECTION 10: FUNCTIONAL PROGRAMMING UTILITIES
// ============================================================================

/**
 * Functional programming helpers for composing functions,
 * currying, and creating pipelines.
 */
const FP = {
  /**
   * Composes multiple functions right-to-left.
   * compose(f, g, h)(x) is equivalent to f(g(h(x))).
   * 
   * @param {...Function} fns - Functions to compose
   * @returns {Function} Composed function
   */
  compose(...fns) {
    return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
  },

  /**
   * Composes multiple functions left-to-right (pipeline).
   * pipe(f, g, h)(x) is equivalent to h(g(f(x))).
   * 
   * @param {...Function} fns - Functions to pipe
   * @returns {Function} Piped function
   */
  pipe(...fns) {
    return (x) => fns.reduce((acc, fn) => fn(acc), x);
  },

  /**
   * Creates a curried version of a function.
   * Each argument returns a new function until all args collected.
   * 
   * @param {Function} fn - Function to curry
   * @returns {Function} Curried function
   */
  curry(fn) {
    const arity = fn.length;
    return function curried(...args) {
      if (args.length >= arity) {
        return fn.apply(this, args);
      }
      return (...nextArgs) => curried(...args, ...nextArgs);
    };
  },

  /**
   * Creates a partial application of a function.
   * Pre-fills some arguments, returns function for rest.
   * 
   * @param {Function} fn - Function to partially apply
   * @param {...any} args - Arguments to pre-fill
   * @returns {Function} Partially applied function
   */
  partial(fn, ...args) {
    return (...remainingArgs) => fn(...args, ...remainingArgs);
  },

  /**
   * Creates a function that returns the negation of predicate.
   * 
   * @param {Function} predicate - Function returning boolean
   * @returns {Function} Negated predicate
   */
  negate(predicate) {
    return (...args) => !predicate(...args);
  },

  /**
   * Creates a memoized version of a pure function.
   * Caches results to avoid recomputing for same inputs.
   * 
   * @param {Function} fn - Pure function to memoize
   * @returns {Function} Memoized function
   */
  memoize(fn) {
    const cache = new Map();
    return (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) return cache.get(key);
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
  },

  /**
   * Creates a function that invokes fn once and caches result.
   * Subsequent calls return cached value.
   * 
   * @param {Function} fn - Function to wrap
   * @returns {Function} Once-wrapped function
   */
  once(fn) {
    let called = false;
    let result;
    return function (...args) {
      if (!called) {
        called = true;
        result = fn.apply(this, args);
      }
      return result;
    };
  },

  /**
   * Creates a function that limits fn to being called at most N times.
   * 
   * @param {Function} fn - Function to limit
   * @param {number} n - Maximum call count
   * @returns {Function} Limited function
   */
  before(fn, n) {
    let count = 0;
    return function (...args) {
      if (count < n) {
        count++;
        return fn.apply(this, args);
      }
    };
  },

  /**
   * Flips the first two arguments of a function.
   * Useful for adapting functions to different data-last/data-first styles.
   * 
   * @param {Function} fn - Function to flip
   * @returns {Function} Flipped function
   */
  flip(fn) {
    return (a, b, ...rest) => fn(b, a, ...rest);
  },

  /**
   * Creates a function that always returns the same value.
   * 
   * @param {any} value - Value to return
   * @returns {Function} Function returning value
   */
  constant(value) {
    return () => value;
  },

  /**
   * Identity function - returns its argument unchanged.
   * Useful as default or placeholder function.
   * 
   * @param {any} x - Value to return
   * @returns {any} Same value
   */
  identity(x) {
    return x;
  },

  /**
   * Creates a function that picks a property from an object.
   * Useful with map() for extracting specific fields.
   * 
   * @param {string} key - Property key to pluck
   * @returns {Function} Plucker function
   */
  pluck(key) {
    return (obj) => obj[key];
  },

  /**
   * Creates a function that checks if object has property equal to value.
   * 
   * @param {string} key - Property to check
   * @param {any} value - Expected value
   * @returns {Function} Matcher function
   */
  propEq(key, value) {
    return (obj) => obj[key] === value;
  },

  /**
   * Creates a comparator function for sorting by property.
   * 
   * @param {string|Function} prop - Property name or accessor function
   * @returns {Function} Comparator for Array.sort()
   */
  sortBy(prop) {
    const accessor = typeof prop === 'function' ? prop : (obj) => obj[prop];
    return (a, b) => {
      const aVal = accessor(a);
      const bVal = accessor(b);
      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
      return 0;
    };
  }
};

// ============================================================================
// SECTION 11: FILE AND BYTE UTILITIES
// ============================================================================

/**
 * File size and byte manipulation utilities.
 */
const FileUtils = {
  /**
   * Formats bytes to human-readable string.
   * Uses binary units (KiB, MiB, etc.) with 1024 base.
   * 
   * @param {number} bytes - Size in bytes
   * @param {number} [decimals=2] - Decimal places
   * @returns {string} Human readable size like "1.50 MiB"
   */
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  },

  /**
   * Parses human-readable size string to bytes.
   * Supports KB, MB, GB, TB (base 1024).
   * 
   * @param {string} str - Size string like "1.5 MB"
   * @returns {number} Size in bytes
   */
  parseBytes(str) {
    const match = str.match(/^([\d.]+)\s*(B|KB|MB|GB|TB|PB)?$/i);
    if (!match) return NaN;
    const value = parseFloat(match[1]);
    const unit = (match[2] || 'B').toUpperCase();
    const multipliers = { B: 1, KB: 1024, MB: 1024**2, GB: 1024**3, TB: 1024**4, PB: 1024**5 };
    return value * (multipliers[unit] || 1);
  },

  /**
   * Converts base64 string to Uint8Array.
   * Works in both browser and Node.js environments.
   * 
   * @param {string} base64 - Base64 encoded string
   * @returns {Uint8Array} Decoded bytes
   */
  base64ToBytes(base64) {
    if (typeof Buffer !== 'undefined') {
      return new Uint8Array(Buffer.from(base64, 'base64'));
    }
    // Browser environment
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  },

  /**
   * Converts Uint8Array to base64 string.
   * 
   * @param {Uint8Array} bytes - Bytes to encode
   * @returns {string} Base64 encoded string
   */
  bytesToBase64(bytes) {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(bytes).toString('base64');
    }
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  },

  /**
   * Converts a data URL to a Blob object.
   * 
   * @param {string} dataUrl - Data URL string
   * @returns {Blob} Blob object
   */
  dataUrlToBlob(dataUrl) {
    const [header, base64] = dataUrl.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const bytes = this.base64ToBytes(base64);
    return new Blob([bytes], { type: mime });
  },

  /**
   * Reads a Blob as a data URL string.
   * Returns a Promise for async reading.
   * 
   * @param {Blob} blob - Blob to read
   * @returns {Promise<string>} Data URL string
   */
  blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
};

// ============================================================================
// SECTION 12: EXPORT AND MODULE SETUP
// ============================================================================

/**
 * Export all utility namespaces for module systems.
 * Supports CommonJS, AMD, and ES module patterns.
 */

const Utils = {
  Math: MathUtils,
  String: StringUtils,
  Date: DateUtils,
  Collection: CollectionUtils,
  Async: AsyncUtils,
  Validate,
  Color: ColorUtils,
  Crypto: CryptoUtils,
  FP,
  File: FileUtils,
  HashMap,
  PriorityQueue
};

// CommonJS export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}

// AMD export
if (typeof define === 'function' && define.amd) {
  define(() => Utils);
}

// Browser global export
if (typeof window !== 'undefined') {
  window.Utils = Utils;
}

// ES module default export
if (typeof exports !== 'undefined') {
  exports.default = Utils;
  exports.Utils = Utils;
}

/**
 * ============================================================================
 * END OF FILE
 * ============================================================================
 * 
 * Total sections: 12
 * Total functions/classes: 80+
 * Total lines: ~1000
 * 
 * This library provides a comprehensive toolkit for common JavaScript tasks
 * without external dependencies. Each function is documented with JSDoc comments
 * including parameters, return types, and usage examples.
 */
