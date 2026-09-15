# Archive of experimental / personal / temporary files moved out of main

This folder contains files that were moved from the repository root and other locations to keep the main branch clean.

If you need a file restored to its original location, you can run:

  git checkout main -- archive/junk-2026-09-15/path/to/file
  git mv archive/junk-2026-09-15/path/to/file path/to/desired/location
  git commit -m "revert: restore file XYZ"

Files moved here are retained in Git history and can be restored at any time.
