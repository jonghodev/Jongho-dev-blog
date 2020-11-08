---
title: Javascript Deep Copy 와 Shallow Copy
date: 2020-11-09 08:11:09
category: development
draft: true
---

Copy 의 종류에는 Shallow Copy 와 Deep Copy 가 있다.

## Shallow Copy

Javascript 에서 Shallow Copy 를 하기 위해선 다음 두 가지 방식이 있다.

- `Object.assgin()` 이용
- Spread 연산자 사용

```javascript
const obj1 = { a: 1 }
const obj2 = { a: 2 }

const shallowCopyResult = Object.assign(obj1, obj2)
```

```javascript
const obj1 = { a: 1 }
const obj2 = { a: 2 }

const shallowCopyResult = { ...obj1, ...obj2 }
```

Object.assign() 은 함수 인자로 넘어온 객체의 자신의 값을 변경시킨다.

그래서 사이드 이펙트를 생길 수 있어서 함수형 프로그래밍에서는 부합하지 않는 방식이다.

그렇다면 원본 객체를 수정하지 않는 Spread 연산자를 사용하면 된다.

## Deep Copy

deepcopy 를 할 때는 배열을 어떻게 병합시킬지에 대한 문재가 있다.

https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6

위 예제에 있는 소스코드와 lodash는, 배열 객체가 있고 안에 같은 키에 있을 때에는 객체를 합치지만

deepcopy 라이브러리는, 무조건 배열로 넣는다.

deepcopy 라이브러리는 원본을 변경시키지 않고

lodash 라이브러리는 `Object.assign()` 함수을 이용하기 때문에 원본을 변경시킨다.

## 출처

https://blog.ull.im/engineering/2019/04/01/javascript-object-deep-copy.html

https://blog.ull.im/engineering/2019/06/10/some-of-useful-javascript-trick.html
