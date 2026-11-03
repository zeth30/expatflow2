/**
 * Simple password gate for the personal-use Steuer page (/freelance-steuer).
 * Deliberately low-security: it only keeps strangers out. Only the SHA-256 of
 * the password lives in this public repo; the cookie holds that hash.
 */
export const GATE_COOKIE = "rx_steuer";
export const GATE_HASH = "7883fc371a4bdedadbe17f5b910dc7928c5f68171daabc62764334b4bad37b83";
export const GATE_PATH = "/freelance-steuer";
