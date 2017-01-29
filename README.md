abrowserify
==========

<!---
This file is generated by ape-tmpl. Do not update manually.
--->

<!-- Badge Start -->
<a name="badges"></a>

[![Build Status][bd_travis_shield_url]][bd_travis_url]
[![npm Version][bd_npm_shield_url]][bd_npm_url]
[![JS Standard][bd_standard_shield_url]][bd_standard_url]

[bd_repo_url]: https://github.com/a-labo/abrowserify
[bd_travis_url]: http://travis-ci.org/a-labo/abrowserify
[bd_travis_shield_url]: http://img.shields.io/travis/a-labo/abrowserify.svg?style=flat
[bd_travis_com_url]: http://travis-ci.com/a-labo/abrowserify
[bd_travis_com_shield_url]: https://api.travis-ci.com/a-labo/abrowserify.svg?token=
[bd_license_url]: https://github.com/a-labo/abrowserify/blob/master/LICENSE
[bd_codeclimate_url]: http://codeclimate.com/github/a-labo/abrowserify
[bd_codeclimate_shield_url]: http://img.shields.io/codeclimate/github/a-labo/abrowserify.svg?style=flat
[bd_codeclimate_coverage_shield_url]: http://img.shields.io/codeclimate/coverage/github/a-labo/abrowserify.svg?style=flat
[bd_gemnasium_url]: https://gemnasium.com/a-labo/abrowserify
[bd_gemnasium_shield_url]: https://gemnasium.com/a-labo/abrowserify.svg
[bd_npm_url]: http://www.npmjs.org/package/abrowserify
[bd_npm_shield_url]: http://img.shields.io/npm/v/abrowserify.svg?style=flat
[bd_standard_url]: http://standardjs.com/
[bd_standard_shield_url]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

<!-- Badge End -->


<!-- Description Start -->
<a name="description"></a>

Bundle with browserify only when file changed from last time

<!-- Description End -->


<!-- Overview Start -->
<a name="overview"></a>



<!-- Overview End -->


<!-- Sections Start -->
<a name="sections"></a>

<!-- Section from "doc/guides/01.Installation.md.hbs" Start -->

<a name="section-doc-guides-01-installation-md"></a>

Installation
-----

```bash
$ npm install abrowserify --save
```


<!-- Section from "doc/guides/01.Installation.md.hbs" End -->

<!-- Section from "doc/guides/02.Usage.md.hbs" Start -->

<a name="section-doc-guides-02-usage-md"></a>

Usage
---------

```javascript
'use strict'

const abrowserify = require('abrowserify')
const co = require('co')

co(function * () {
  yield abrowserify('src/entrypoint.js', 'public/bundle.js', {
    debug: true
  })
}).catch((err) => console.error(err))

```


<!-- Section from "doc/guides/02.Usage.md.hbs" End -->

<!-- Section from "doc/guides/03.Signature.md.hbs" Start -->

<a name="section-doc-guides-03-signature-md"></a>

Signature
---------

`abrowserify(src, dest, options) -> Promise`

### Params

| Name | Type | Description |
| ----- | --- | -------- |
| src | string | Source file name |
| dest | string | Destination file name |
| options | Object | Optional settings |
| options.status | string | Status file path |
| options.cache | string | Cache file path |
| options.reflects | string[] | File patterns to reflects changes |



<!-- Section from "doc/guides/03.Signature.md.hbs" End -->


<!-- Sections Start -->


<!-- LICENSE Start -->
<a name="license"></a>

License
-------
This software is released under the [MIT License](https://github.com/a-labo/abrowserify/blob/master/LICENSE).

<!-- LICENSE End -->


<!-- Links Start -->
<a name="links"></a>

Links
------



<!-- Links End -->
