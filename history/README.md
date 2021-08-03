# History -- Change management

Change information is made available explicitly, so clients can update only changed assets, without accessing version information from git.

Change information can be found in the folder `history`.

There is the `history/LATEST.json` file, which always contains the current version info:

- `versionNum`: a simple numerical version designator (e.g. 42).
- commit: the git commit SHA of the head of the master branch, info only.
- date: the date time of the last commit, info only.

The folder `history/versions` contains 1 file per version, named `<version>.json`, e.g. `42.json`.
This file contains the list of changed files between the two versions, plus some meta info.

If there are many files changed, the files are not listed, but `"fullChange": true` is set.

An example of a change file is:

```json
{
    "versionEnd": {
        "versionNum": 2,
        "commit": "159cec70437445948d3081a0b1564b436bccb646",
        "date": "2021-02-22T15:26:24.985Z"
    },
    "versionStart": {
        "versionNum": 1,
        "commit": "f5117527c2e1dd89d51b72c3634d94edb5a04780",
        "date": "2021-02-22T14:56:47.938Z"
    },
    "fullChange": false,
    "changeCount": 12,
    "changes": [
        "blockchains/ethereum/allowlist.json",
        "blockchains/ethereum/assets/0x67c597624B17b16fb77959217360B7cD18284253/info.json",
        "blockchains/ethereum/assets/0x67c597624B17b16fb77959217360B7cD18284253/logo.png",
        "blockchains/ethereum/assets/0x798D1bE841a82a273720CE31c822C61a67a601C3/info.json",
        "blockchains/ethereum/assets/0x798D1bE841a82a273720CE31c822C61a67a601C3/logo.png",
        "history/LATEST.json",
        "history/versions/PLACEHOLDER",
        "package.json",
        "script/config.ts",
        "script/entrypoint/history.ts",
        "script/generic/history.ts",
        "script/generic/update-all.ts"
    ]
}
```
