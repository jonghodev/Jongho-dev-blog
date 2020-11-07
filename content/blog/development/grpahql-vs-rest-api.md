---
title: GrpahQL vs REST API
date: 2020-11-07 22:11:32
category: development
draft: false
---

## REST API

REST API 란 Representational State Transfer 의 약자이다.

자원을 이름으로 분류헤 자원의 상태를 주고 받는 모든 것을 의미한다.

하나의 자원은 하나의 Endpoint 에 연결이 된다.

## GraphQL

GraphQL 은 Grpahql Query Language 의 약자이다.

Graphql 은 Server API 를 구성하기 위해 Facebook 에서 만든 Query Language 이다.

Grpahql 은 단일 Endpoint 를 사용한다.

요청시 Query 문에 따라 응답의 구조가 달라진다. 따라서 유연하다.

Facebook 에서 GraphQL 을 [만든 이유](https://graphql.org/blog/graphql-a-query-language/)는 다음과 같다.

> RESTful API 로는 다양한 기종에서 필요한 정보들을 일일히 구현하는 것이 힘들었다.
> 예로, iOS 와 Android 에서 필요한 정보들이 조금씩 달랐고, 그 다른 부분마다 API 를 구현하는 것이 힘들었다.

이 때문에 클라이언트에서 원하는 정보만 가지고 올 수 있게 표준화된 Query Language 를 만들게 된 것이다.

### 장점

- HTTP 요청 수를 줄일 수 있다.
- RESTFul 은 Resource 종류에 따라 요청 횟수가 비례한다. 반면 GraphQL 은 원하는 정보를 하나의 Query 에 담아 요청하는 것이 가능하다.
- HTTP 응답의 사이즈도 줄일 수 있다.

### 단점

- File 전송 등 Text 만으로 하기 힘든 내용을 처리하기 복잡하다.
- 고정된 요청과 응답만 필요할 경우에는 Query 로 인해 요청의 크기가 Restful API 의 경우보다 더 커진다.
- 재귀적인 Query 가 불가능하다.
