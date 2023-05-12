# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 1.1.9 (2023-05-07)

### [1.1.8](https://github.com/kaltura/playkit-js-share/compare/v1.1.7...v1.1.8) (2023-02-22)


### Bug Fixes

* **FEC-12916:** share Plugin Keyboard Functionality ([#19](https://github.com/kaltura/playkit-js-share/issues/19)) ([4dcbb19](https://github.com/kaltura/playkit-js-share/commit/4dcbb192e55a7a02f65f48a57a583d769ebf632f))

### [1.1.7](https://github.com/kaltura/playkit-js-share/compare/v1.1.6...v1.1.7) (2023-01-26)


### Bug Fixes

* **FEC-12879:** share plugin does not work when the share icon inside the more plugin ([#17](https://github.com/kaltura/playkit-js-share/issues/17)) ([a17b45e](https://github.com/kaltura/playkit-js-share/commit/a17b45ef944c35bba2940b7d9a348b46193d1015))
* **FEC-12896:** update version -  "playkit-ui-managers": "1.3.4" ([#18](https://github.com/kaltura/playkit-js-share/issues/18)) ([1e885fd](https://github.com/kaltura/playkit-js-share/commit/1e885fd88a2a0c360bcc743f187bca1527fc8d4f))

### [1.1.6](https://github.com/kaltura/playkit-js-share/compare/v1.1.5...v1.1.6) (2022-12-28)


### Bug Fixes

* **FEC-12809:** Incorrect order of plugins ([#16](https://github.com/kaltura/playkit-js-share/issues/16)) ([5724af5](https://github.com/kaltura/playkit-js-share/commit/5724af52490620d09a7c224018189ebd9ac8e0b2))

### [1.1.5](https://github.com/kaltura/playkit-js-share/compare/v1.1.4...v1.1.5) (2022-12-07)

### [1.1.4](https://github.com/kaltura/playkit-js-share/compare/v1.1.3...v1.1.4) (2022-12-07)


### Bug Fixes

* **FEC-12559:** Share plugin - integration with the new Upper Bar Manager service API ([#14](https://github.com/kaltura/playkit-js-share/issues/14)) ([e419b4d](https://github.com/kaltura/playkit-js-share/commit/e419b4dd5b5b250474ccff33294ce68ed0f129f2)), closes [kaltura/playkit-js-ui-managers#10](https://github.com/kaltura/playkit-js-ui-managers/issues/10)

### [1.1.3](https://github.com/kaltura/playkit-js-share/compare/v1.1.2...v1.1.3) (2022-06-09)


### Bug Fixes

* **FEC-12266:** v7 Share button generates mostly blank email, due to Ampersand ([#11](https://github.com/kaltura/playkit-js-share/issues/11)) ([eb948e4](https://github.com/kaltura/playkit-js-share/commit/eb948e40afb37e578d97033964db8ad8625eb210))


### Build System

* set prerelease false ([12ee1c0](https://github.com/kaltura/playkit-js-share/commit/12ee1c079eecc9b4cce8118786419f9b8d56d420))

### [1.1.2](https://github.com/kaltura/playkit-js-share/compare/v1.1.1...v1.1.2) (2021-07-27)

### [1.1.1](https://github.com/kaltura/playkit-js-share/compare/v1.1.0...v1.1.1) (2021-07-27)


### Bug Fixes

* **FEC-11253:** Remove start time from UI when sharing a live stream ([#8](https://github.com/kaltura/playkit-js-share/issues/8)) ([4eadb84](https://github.com/kaltura/playkit-js-share/commit/4eadb84d8dae47bac07b3e19ab1bd9172e9d5547))
* **FEC-11392:** document.querySelector breaks ([#9](https://github.com/kaltura/playkit-js-share/issues/9)) ([bcaee25](https://github.com/kaltura/playkit-js-share/commit/bcaee25f141cd0105beb1af27c609991c46bbfba))


### Build System

* Ignore tests for release & tag commit ([6f57feb](https://github.com/kaltura/playkit-js-share/commit/6f57feb300148980be8fc6a5afbacd163a909066))
* **FEC-11389:** reduce builds from travis ([2b578bb](https://github.com/kaltura/playkit-js-share/commit/2b578bb292f64ab85183c454d4f437da3991fe88))

## 1.1.0 (2021-07-01)


### Features

* **FEC-10835:** expose share to plugin ([#1](https://github.com/kaltura/playkit-js-share/issues/1)) ([a56a63f](https://github.com/kaltura/playkit-js-share/commit/a56a63fa3ab13ef8014dbfe8c838ff1cbe050adb))


### Bug Fixes

* **FEC-11377:** IE doesn't support replaceAll ([#7](https://github.com/kaltura/playkit-js-share/issues/7)) ([5c5f048](https://github.com/kaltura/playkit-js-share/commit/5c5f04802c1f628c6453f32b8dc980e756516019))
* allow empty shareOptions ([b48a953](https://github.com/kaltura/playkit-js-share/commit/b48a95397e016a3f2eb9d536fecbace53f36782a))
* hide embed for empty embedUrl ([c6492cf](https://github.com/kaltura/playkit-js-share/commit/c6492cfcad99ec7d5b2ffe6ba2be6018523d8bc1))
* **FEC-11338:** update share ui ([#5](https://github.com/kaltura/playkit-js-share/issues/5)) ([9a961b6](https://github.com/kaltura/playkit-js-share/commit/9a961b6c93b757723b77b3ae79dea8c55ce33001))
* **FEC-11369:** add embedUrl and naming convention ([#6](https://github.com/kaltura/playkit-js-share/issues/6)) ([d78caaa](https://github.com/kaltura/playkit-js-share/commit/d78caaa79da09a440109449d3c2f174617617fad))
* relocate the share component ([#2](https://github.com/kaltura/playkit-js-share/issues/2)) ([07966e9](https://github.com/kaltura/playkit-js-share/commit/07966e9f5f1be7eee1f80ad2ff09ff2756050bc6))
* remove unused property ([66451ad](https://github.com/kaltura/playkit-js-share/commit/66451adc2eb2fbc6d6ea93ec424df708adf8d4db))


### Build System

* fix lint and flow ([#4](https://github.com/kaltura/playkit-js-share/issues/4)) ([00af616](https://github.com/kaltura/playkit-js-share/commit/00af61642adb771ae766206f3a752b0be142fc79))
* fix travis comment row ([#3](https://github.com/kaltura/playkit-js-share/issues/3)) ([accedc8](https://github.com/kaltura/playkit-js-share/commit/accedc87515817b02d8798f63b57e1e841680b27))
