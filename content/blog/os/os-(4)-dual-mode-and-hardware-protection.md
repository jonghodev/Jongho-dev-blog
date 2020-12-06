---
title: OS (4) Dual mode and Hardware protection
date: 2020-11-19 07:00:00
category: os
draft: false
---

## 이중모드

User mode, System mode 가 있다.

Privileged Instruction 은 system mode 접근할 수 있다.

CPU 에는 레지스터가 있다. 이 레지스터 하나에 비트들이 기록이 된다.

그리고 Monitor 라는 레지스터가 있는데 이 레지스터의 값이 1이면 system mode. 0 이면 user mode 인 것으로 작동한다.

## 하드웨어 보호

### 입출력장치 보호

입출력 명령은 Privileged Instruction 으로 한다. IN, OUT

입출력을 하려면 OS에게 요청해야 한다. 그리고 이때 system mode 로 전환이 된다. OS 는 입출력을 대행하고, 요청을 마친 후 다시 user mode 로 복귀한다.

올바른 요청이 아니면 OS 는 거부하고 (Privileged instruction violation) ISR 이 동작해 해당 프로그램을 강제 종료시킨다.

### 메모리 보호

**Memory Management Unit**(MMU)

OS 가 설정한 Base 와 Limit 사이의 메모리 참조만 허락한다.

만약 허락되지 않는 주소에 접근하려는 경우 MMU 에서 CPU 로 (Segment violation) ISR 을 건다. 해당 프로그램을 강제 종료시킨다.

### CPU 보호

한 사용자가 실수 또는 고의로 CPU 시간을 독점

- 예: while (n=1)
- 다른 사용자의 프로그램 실행 불가

해결법

- Timer 를 두어 일정 시간 경과 시 타이머 인터럽트
- 인터럽트 > 운영체제 > 다른 프로그램으로 강제 전환

## 출처

http://www.kocw.net/home/search/kemView.do?kemId=978503
