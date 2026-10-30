# HYG bright-star extract: attribution and data license

`bright-star-catalog.js` contains a selected, reformatted 20-record extract from **HYG 4.1**, by **David Nash / Astronexus and HYG contributors**. The original incorporates Hipparcos, Yale Bright Star and Gliese data. This extract is distributed under **Creative Commons Attribution-ShareAlike 4.0 International**: <https://creativecommons.org/licenses/by-sa/4.0/>. The separate application code keeps its existing license; this notice does not relicense the repository.

- Pinned source: <https://raw.githubusercontent.com/astronexus/HYG-Database/c7f7f883fe678cc7680169a50ccd7dcc49b060ce/hyg/CURRENT/hygdata_v41.csv>
- Commit: `c7f7f883fe678cc7680169a50ccd7dcc49b060ce`
- Original CSV SHA-256: `d9f69fd86bbf90a4e4d52b4c5c53eacfa6dfc0bfdef85bfd94f095e0bebe4ebd`
- Original license: <https://github.com/astronexus/HYG-Database/blob/c7f7f883fe678cc7680169a50ccd7dcc49b060ce/hyg/CURRENT/LICENSE>
- Field documentation: <https://github.com/astronexus/HYG-Database/blob/c7f7f883fe678cc7680169a50ccd7dcc49b060ce/hyg/README.md>
- Current upstream development: <https://codeberg.org/astronexus/hyg>

Changes made here: selected 20 familiar named records; retained HIP/HYG identifiers, name, constellation abbreviation, RA/Dec, distance, proper motions, radial velocity, magnitude, and Cartesian position/velocity fields; converted numeric CSV fields to JavaScript numbers; renamed identifier fields. No numerical catalogue value was recalibrated. The selection is neither complete by magnitude nor representative of every culture or constellation.

The catalogue's Cartesian position is parsecs in J2000 equatorial axes; velocity is parsecs per year derived upstream from proper motion and available radial velocity. `dist >= 100000` is an invalid/uncertain distance sentinel and must never be treated as a physical distance. No selected record has that sentinel. Values and uncertainties retain the catalogue's limitations. Propagated coordinates are application calculations, not fresh observations. The inherited Behenian historical catalogue is a different dataset and is not silently replaced by this extract.
