This is a **placeholder writeup** so you can see how the format renders. Delete or replace it once you publish your first real one — see `README.md` for the two-step process.

## The idea

Some JWT libraries will accept a token where the `alg` field in the header is set to `none`, and skip signature verification entirely. If a server is misconfigured this way, you can forge a token by:

1. Base64url-encoding a header of `{"alg":"none","typ":"JWT"}`
2. Base64url-encoding whatever payload claims you want
3. Joining them with a dot, and leaving the signature segment empty

```
eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VyIjoiYWRtaW4ifQ.
```

## What normally goes wrong for the attacker

Most modern JWT libraries reject `alg: none` by default now, so this specific bug is rarer in the wild than a few years ago — it's still worth checking for on older codebases or hand-rolled verification logic.

## Notes to self

- Always check how the *server* selects the verification algorithm, not just what the client sends.
- Worth testing alongside algorithm confusion (RS256 → HS256) on the same target.

> Replace all of this with your actual lab notes, screenshots, and commands.
