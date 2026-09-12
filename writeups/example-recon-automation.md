Another placeholder — this one shows a longer writeup with a couple of sections and a bigger code block, since a lot of your real notes will probably look like this.

## Why automate recon

The first hour of most VAPT engagements is repetitive: resolve scope, run a port scan, grab service banners, and check for the obvious low-hanging fruit before the real testing starts. A small script removes the busywork.

## A minimal version

```bash
#!/usr/bin/env bash
# recon.sh <target>
target="$1"

mkdir -p "results/$target"
nmap -sV -oN "results/$target/nmap.txt" "$target"
whatweb "$target" > "results/$target/whatweb.txt"
nikto -h "$target" -o "results/$target/nikto.txt"

echo "Done. See results/$target/"
```

## Where this goes next

- Feed the nmap output straight into a templated findings table.
- Add a step that flags anything matching known default-credential services.
- Keep the raw tool output alongside the polished report — clients occasionally ask for it.

Replace this file with a real writeup whenever you're ready — same manifest entry, same rendering.
