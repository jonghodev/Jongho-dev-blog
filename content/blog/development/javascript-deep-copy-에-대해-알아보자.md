---
title: Javascript Deep copy 에 대해 알아보자
date: 2020-11-09 06:11:35
category: development
draft: true
---

https://blog.ull.im/engineering/2019/04/01/javascript-object-deep-copy.html

deepcopy 를 할 때는 배열을 어떻게 병합시킬지에 대한 문재가 있다.

https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6

위 예제에 있는 소스코드와 lodash는, 배열 객체가 있고 안에 같은 키에 있을 때에는 객체를 합치지만

deepcopy 라이브러리는, 무조건 배열로 넣는다.

deepcopy 라이브러리는 원본을 변경시키지 않고

lodash 라이브러리는 `Object.assign()` 함수을 이용하기 때문에 원본을 변경시킨다.
