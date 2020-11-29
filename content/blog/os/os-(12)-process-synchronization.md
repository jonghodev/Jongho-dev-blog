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

## The Critical-Section Problem

[임계구역](https://en.wikipedia.org/wiki/Critical_section) 문제에 대해서 알아보자.

### Critical section

- A system consisting of multiple threads
- Each thread has a segment of code, called critical section, in which the thread may be changing common variables, updating a table, writing a file, and so on.

### Solution

- Mutual exclusion (상호배타): 오직 한 쓰레드만 진입
- Progress (진행): 진입 결정은 유한 시간 내
- Bounded waiting (유한대기): 어느 쓰레드라도 유한 시간 내

### 동기화 도구

- [Semaphores](<https://en.wikipedia.org/wiki/Semaphore_(programming)>)
- [Monitors](<https://en.wikipedia.org/wiki/Monitor_(synchronization)>)

## Semaphores

```java
class Semaphore {
  int value;

  Semaphore(int value) {
    this.value = value;
  }

  void acquire() {
    value--;
    if (value < 0) {
      add this process/thread to list;
      block;
    }
  }

  void release() {
    value++;
    if (value <= 0) {
      remove a process P from list;
      wakeup P;
    }
  }
}
```

위와 같은 코드 래밸의 구조를 가지고 있다.

![](https://flylib.com/books/1/410/1/html/2/images/16.1.jpg)

Process 혹은 Thread 는 공유 자원이 있는 **Critical Section** 에 접근할 때 `aquire()` 함수를 호출한다.

그리고 접근이 끝나면 `release()`함수를 호출한다.

만약 초기 value 값이 1이라고 해보자. A 프로세스가 `aquire()`함수를 호출하고 임계 구역에 들어갔다고 하자.

그리고 다른 B Process 가 그곳에 접근하면 현재 세마포 value 값이 0이 되어있으므로 어떤 Queue 에 갇히게 된다.

그리고 A 프로세스가 작업이 끝나면 `release()` 함수를 호출함으로써 리스트에 있는 프로세스를 꺼내고 wakeup 시킴으로써

B Process 가 임계구역에 들어갈 수 있게 된다.

이렇게 임계구역에는 한 번에 한 프로세스만 들어갈 수 있게 해서 Mutual Exclusion 을 성립시킨다.

## 예제: Bank Acrount Problem

Seamphore 를 활용하여 Mutual Exclusion 을 구현한 예제를 살펴보자.

Main.java

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        BankAccount b = new
                BankAccount();
        Parent p = new Parent(b);
        Child c = new Child(b);
        c.start();
        p.start();
        p.join();
        c.join();
        System.out.println( "\nbalance = " + b.getBalance());
    }
}
```

Parent.java

```java
public class Parent extends Thread {
    BankAccount b;
    Parent(BankAccount b) {
        this.b = b;
    }
    public void run() {
        for (int i=0; i<100000; i++)
            b.deposit(1000);
    }
}
```

Child.java

```java
public class Child extends Thread {
    BankAccount b;
    Child(BankAccount b) {
        this.b = b;
    }
    public void run() {
        for (int i=0; i<100000; i++)
            b.withdraw(1000);
    }
}
```

BankAccount.java

```java
import java.util.concurrent.Semaphore;

public class BankAccount {
    int balance;
    Semaphore dSam;
    Semaphore wSam;

    public BankAccount() {
        dSam = new Semaphore(0);
        wSam = new Semaphore(0);
    }

    void deposit(int amount) {
        int temp = balance + amount;
        System.out.print("+");
        balance = temp;
        wSam.release();
        try {
            dSam.acquire();
        } catch (InterruptedException e) {}
    }
    void withdraw(int amount) {
        try {
            wSam.acquire();
        } catch (InterruptedException e) {}
        int temp = balance - amount;
        System.out.print("-");
        balance = temp;
        dSam.release();
    }
    int getBalance() {
        System.out.println(balance);
        return balance;
    }
}

```

위와 같은 방식으로 Parent 가 입금을 하고 나서 Child 가 돈을 출금하는

Ordering 과 Mutual Exclusion 을 구현할 수 있다.

출력 값은 다음과 같을 것이다.

```bash
+-+-+-+-, ...

balance = 0
```

## 생산자-소비자 문제(Producer and Consumer Problem)

- 생산자-소비자 문제
  - 생산자가 데이터를 생산하면 소비자는 그것을 소비
  - 예: 컴파일러 > 어셈블러, 파일 서버 > 클라이언트, 웹 서버 > 웹 클라이언트
- Bounded Buffer
  - 생산된 데이터는 버퍼에 일단 저장 (속도 차이 등)
  - 현실 시스템에선 버퍼 크기는 유한
  - 생산자는 버퍼가 가득 차면 더 넣을 수 없다.
  - 소비자는 버퍼가 비면 뺼 수 없다.
- Busy-Wait
  - 생산자: 버퍼가 가득 차면 기다려야 = 빈(empty) 공간이 있어야 함.
  - 소비자: 버퍼가 비면 기다려야 = 찬(full) 공간이 있어야 함.

## 유한버퍼 문제(Bounded Buffer Problem) 예제

```c
semaphore fillCount = 0; // items produced
semaphore emptyCount = BUFFER_SIZE; // remaining space

procedure producer()
{
    while (true)
    {
        item = produceItem();
        down(emptyCount);
        putItemIntoBuffer(item);
        up(fillCount);
    }
}

procedure consumer()
{
    while (true)
    {
        down(fillCount);
        item = removeItemFromBuffer();
        up(emptyCount);
        consumeItem(item);
    }
}
```

출처: https://en.wikipedia.org/wiki/Producer%E2%80%93consumer_problem

위 방식은 세마포를 사용해 해결한 방식이다. Empty 세마포의 값을 버퍼 사이즈로 주어서

생산을 하고 난 후에는 Empty 세마포의 값을 낮추고(aquire()) 버퍼에 생산한 데이터를 넣는다.

그리고 버퍼에 데이터가 들어간 것을 알려주기 위해 Fill 세마포에 1을 올려준다. (release())

소비를 할 때는, 우선 Fill 세마포에서 값을 낮추고(aquire()) 버퍼에서 데이터를 꺼낸다

그 후 Empty 세마포의 값을 올리고 데이터를 사용한다.

하지만, 위와 같은 방식은 생산자와 소비자가 1개씩 존재할 때만 적용된다. 즉, 생산자 소비자 간의 공유 자원 접근에 대한 문제는 없지만

여러개의 생산자가 생산자 코드에 접근할 때, 그리고 여러 개의 소비자가 소비자 코드에 접근할 때 또다시 동시성 문제가 발생할 수 있다.

다음 코드를 통해 해결하자.

## 유한버퍼 문제(Bounded Buffer Problem) 예제 (개선)

```c
mutex buffer_mutex; // similar to "semaphore buffer_mutex = 1", but different (see notes below)
semaphore fillCount = 0;
semaphore emptyCount = BUFFER_SIZE;

procedure producer()
{
    while (true)
    {
        item = produceItem();
        down(emptyCount);
        down(buffer_mutex);
        putItemIntoBuffer(item);
        up(buffer_mutex);
        up(fillCount);
    }
}

procedure consumer()
{
    while (true)
    {
        down(fillCount);
        down(buffer_mutex);
        item = removeItemFromBuffer();
        up(buffer_mutex);
        up(emptyCount);
        consumeItem(item);
    }
}
```

출처: https://en.wikipedia.org/wiki/Producer%E2%80%93consumer_problem

처음 코드와 다르게 buffer_mutext 라는 버퍼 뮤텍스를 두어서, 해당 버퍼에 접근할 수 있는 뮤텍스를 두어 관리한다.

## Readers-Writers Problem

Readers-Writers Problem 에는 대표적으로 공통 데이터베이스 문제가 있다.

한 프로세스가 Read 를 할 때 Write 프로세스는 접근할 수 있지만

효율성을 위해서 또다른 Read Process 가 접근하는 것은 허용할 수 있다.

그런데 계속해서 Read Process 가 생기다보면 Writer 를 하려는 Process 는 영원히 자원에 접근할 수 없는 문제가 발생할 수 있다.

## 출처

http://www.kocw.net/home/search/kemView.do?kemId=978503

http://contents.kocw.or.kr/KOCW/document/2013/kyungsung/yangheejae/os03.pdf

https://en.wikipedia.org/wiki/Producer%E2%80%93consumer_problem
