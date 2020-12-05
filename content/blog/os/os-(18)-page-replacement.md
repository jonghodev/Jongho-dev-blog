---
title: OS (18) Page Replacement
date: 2020-12-06 07:00:00
category: os
draft: true
---

## 페이지 교체

메모리 가득 차면 추가로 페이지를 가져오기 위해 어떤 페이지는 **Backing Store** 로 몰아내고 **(page-out)** 그 빈 공간으로 페이지를 가져온다. **(page-in)**

이때 **page-out** 된 페이지를 **Victim Page** 라고한다.

## Victim Page

Page out 된 페이지를 Victim Page 라고 한다.

어떤 페이지를 그러면 Victim Page 로 선택해야할지 생각해보자.

만약 Page out 이 된다면 그 이후에 몰아내진 Victim Page 는 Backing Store, 즉 하드 디스크에 다시 그 페이지를 기록해야할 것이다.

근대 만약 그 페이지가 변경된 적이 없는 페이지라면 다시 Backing Store 에 Write 를 할 필요가 없다. 이 Write 하는 것은 IO 시간을 유발하므로 가능한 피하는 것이 좋다.

Page Table 에는 modified bit (=dirty bit) 라는 것을 두어서 수정된 적이 없는 페이지를 가능한 골라서 그것을 몰아낸다. 이렇게하면 다시 Hardware 에 Write 를 하지 않아도 되기 때문이다.

## Page Repalcement Algorithm

- FIFO
- OPT
- LRU

### FIFO

Idea: 초기화 코드는 더 이상 사용이 안 될 것.

가장 먼저 메모리에 올라온 프로세스 순으로 Victim Page 로 선택한다.

### Belady's Anomaly

원래는 Frame 수가 증가하면 Page Fault 가 감소해야하는데

FIFO 를 사용하면, Frame 수가 증가하면 Page Fault 가 증가할 때가 있다.
