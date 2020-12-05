---
title: OS (11) Thread
date: 2020-11-26 12:37:00
category: os
draft: false
---

### 다중 쓰레드

- 한 프로그램에 2개 이상의 맥
- 맥이 빠른 시간 간격으로 스위칭 된다. => 여러 맥이 동시에 실행되는 것처럼 보인다.

Thread 도 Process의 시분할처럼 여러 번 스위칭되어서 동시에 동작하는 것처럼 보인다.

### Single thread vs Multi thread

단일 쓰레드 (single thread) 프로그램: 한 프로세스에 기본 1개의 쓰레드가 있다.

다중 쓰레드 (multi thread) 프로그램: 한 프로세스에 여러 개의 쓰레드가 있다.

현대 프로그램은 대부분 Multi Thread 프로그램이다.

### 쓰레드의 구조

- 프로세스의 메모리 공간 공유 (code, data)
- 프로세스의 자원 공유 (file, i/o, ...)
- 비공유: 개별적인 PC, SP, registers, stack

> PC 는 공유하지 않는다. 서로 실행하는 위치를 같게하면 문제가 생기기 때문이다.

## 출처

http://www.kocw.net/home/search/kemView.do?kemId=978503
