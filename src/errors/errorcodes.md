# success

1 0 0: any success

# error

0 0 0: general error (specifics unknown)

0 1 0: any parameter error
0 1 1: parameter missing error (e.g. should have state but not present)
0 1 2: parameter malformed error (e.g. is string but should be uuid format)
0 1 3: parameter wrong type error (e.g. non int parseable)'
0 1 4: password strength error (e.g. too short, no numbers, no caps)

0 2 0: any authentication error
0 2 1: bad login credentials
0 2 2: refresh token error
0 2 3: state not present
0 2 4: state wrong status
0 2 5: mail in use
0 2 6: too many attempts (e.g. when verificating)
0 2 7: wrong code (e.g. when verificating)
0 2 8: tokens were not present on database

0 3 0: any service provider error e.g. email service error, database initialisation, etc.
0 3 1: No sendgrid key present

0 4 0: any MyAnimeListErrors e.g. no connection
0 4 1: Connecting to MAL failed

first number is status so success/error

incase of error
second number is type of error. e.g. parameter, general, connection, etc.
third is specificly which one
