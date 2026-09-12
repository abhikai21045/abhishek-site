Code: [github.com/abhikai21045/Scripts/blob/main/recon.sh](https://github.com/abhikai21045/Scripts/blob/main/recon.sh) 

I've been using small scripts to automate the first hour of a recon phase which includes port scanning, service banner grabbing, basic repetitive tasks. 
Most of the beginner-friendly examples I found online, and one I actually used, all shared the same flaw: they write output to a fixed filename.

---

## The problem

A script that does this:
```bash
nmap -sV "$1" > output.txt
```

works perfectly the first time. Run it again against a new target and `output.txt` gets overwritten. I lost an earlier scan's results this way and didn't notice until I went looking for them.

A temporary fix could be to use this :
```bash
nmap -sV "$1" >> output.txt
```
Output will not be overwritten but will be appended to the end of the file, doing so is not a long term solution.

---

## The fix: one folder per run

Instead of a fixed filename, every run gets its own folder, named after the target and the exact second it ran:

```bash
timestamp="$(date +%Y-%m-%d_%H-%M-%S)"
run_dir="results/${target}/${timestamp}"
mkdir -p "$run_dir"
```

So a scan against `10.0.0.5` produces `results/10.0.0.5/2026-09-12_14-37-24/` — and running it again a minute later produces a *different* folder. Nothing can ever overlap, because the timestamp is unique down to the second.

## Skipping tools that aren't installed

I also didn't want the whole script to die just because one tool (say `nikto`) wasn't installed on a given machine. A small helper checks first:

```bash
run_if_available() {
  local tool_name="$1"
  local output_file="$2"
  shift 2

  if ! command -v "$tool_name" &> /dev/null; then
    echo "  [skipped] $tool_name is not installed"
    return
  fi

  "$@" > "${run_dir}/${output_file}" 2>&1
}
```

Adding a new tool to the recon pass is now just one more line like:

```bash
run_if_available nmap "nmap.txt" nmap -sV "$target"
```

## A shortcut to the latest run (Additional functionality for fun)

Typing out a full timestamp to find your most recent scan gets frustrating quickly, so the script also creates a lastest file's link in the folder named `latest`

```bash
latest_link="results/${target}/latest"
rm -f "$latest_link"
ln -s "$timestamp" "$latest_link"
```

`results/10.0.0.5/latest` always points at whatever the newest run was, without duplicating any files.

## Testing it

Ran it twice back-to-back against the same target to confirm the fix actually holds:

```
results/10.0.0.5/2026-09-12_14-37-24/nmap.txt
results/10.0.0.5/2026-09-12_14-37-24/run-info.txt
results/10.0.0.5/2026-09-12_14-37-25/nmap.txt
results/10.0.0.5/2026-09-12_14-37-25/run-info.txt
results/10.0.0.5/latest
```

Two separate folders, one second apart, both intact.

### Future steps (Maybe)
- Feed each run's `nmap.txt` straight into a findings-table template instead of reading it by hand.
