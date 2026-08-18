# Research notes: real avatar candidates

## ToxSam/open-source-avatars

URL: https://github.com/toxsam/open-source-avatars

The repository describes itself as a directory of 3D VRM avatars and states that each avatar includes a direct VRM download link, preview images, and license metadata. It distinguishes original CC0 collections from community collections with CC0 or CC-BY terms. The repository contains `LICENSE` and links to `data/projects.json` and `data/avatars/100avatars-r1.json`. The README states that VRM is a 3D avatar format suitable for web browsers and other runtimes. Candidate assets must still be selected individually from the metadata before redistribution.

## Current Avatar repository

URL: https://github.com/magen-gillan/Avatar

The repository used earlier contains four WebP image assets (`aqua.webp`, `darkness.webp`, `wiz.webp`, `megumin.webp`) but no VRM, GLB, GLTF, Live2D model3.json, or moc3 files. GitHub metadata did not expose a recognized license file, so these assets should not be treated as redistributable production models without explicit permission.

## Technical implication

The current alish02 procedural characters must be replaced with actual VRM files from a clearly licensed source. The image packages from Avatar are not sufficient for a real 3D avatar or lip-sync runtime and should be removed from the final avatar stage when real models are available.
