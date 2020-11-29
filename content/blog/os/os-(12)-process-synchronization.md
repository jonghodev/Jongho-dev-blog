---
title: OS (12) process synchronization
date: 2020-11-27 07:00:00
category: os
draft: false
---

## Process Synchronization (cf. Thread Synchronization)

Process 간에 Synchronization 과 Thread 간의 Synchronization 이 일어날 수 있어 이를 모두 고려해야한다.

## Processes

- Independent vs Cooperation
- 프로세스간 통신: 전자우편, 파일 전송
- 프로세스간 자원 공유: 메모리 상의 자료들, 데이터베이스 등

협력이 이루어지는 프로세스를 Cooperating, 혼자서만 작동하는 프로세스를 Independent 한 프로세스라고 한다.

현대 애플리케이션은 대부분 Cooperating Process 이다.

그리고 프로세스간 통신이 일어나다보면 동시성 문제가 발생할 수 있어서 해당 문제를 해결하는 것은 매우 중요하다.

따라서 Critical Section, 즉 공유 자원을 최대한 작게 가져가는 것이 좋다.

## 출처

http://www.kocw.net/home/search/kemView.do?kemId=978503
