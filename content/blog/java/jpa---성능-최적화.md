---
title: JPA - 성능 최적화
date: 2020-10-17 16:10:13
category: java
draft: false
---

본 포스팅은 [자바 ORM 표준 JPA 프로그래밍](https://www.aladin.co.kr/shop/wproduct.aspx?itemid=62681446) 책을 읽고 쓰는 포스팅입니다.

좋은 책 써주셔서 감사합니다. 김영한님.

## N+1 문제

```java
@Entity
public class Member {
	@Id @GeneratedValue
	private Long id;

	@OneToMany(mappedBy = "member", fetch = FetchType.EAGER)
	private List<Order> orders = new ArrayList<>();
}
```

위와 같은 엔티티가 있다.

```java
em.find(Member.class, id)
```

위의 메소드로 조회한 SQL 은 다음과 같다.

```sql
SELECT M.*, O.*
FROM
		MEMBER M
OUTER JOIN ORDERS O ON M.ID=O.MEMBER_ID
```

조인을 이용해 한 번에 조회하는 것을 볼 수 있다.

```java
List<Member> members =
		em.createQuery("select m from Member m", Member.class)
		.getResultList();
```

위의 메소드로 조회한 SQL 은 다음과 같다.

```sql
SELECT * FROM MEMBER
```

문제는 여기서 발생한다. SQL 의 실행 결과로 먼저 회원 엔티티를 로딩한다. 그런데 글로벌 전략이 즉시 로딩으로 설정되어 있으므로 JPA 는 주문 컬렉션을 즉시 로딩하려고 다음 SQL 을 List 의 수만큼 추가로 실행한다.

```sql
SELECT * FROM ORDERS WHERE MEMBER_ID=?
SELECT * FROM ORDERS WHERE MEMBER_ID=?
SELECT * FROM ORDERS WHERE MEMBER_ID=?
SELECT * FROM ORDERS WHERE MEMBER_ID=?
SELECT * FROM ORDERS WHERE MEMBER_ID=?
...
```

위 문제는 글로벌 전략을 지연 로딩으로 설정하여도 비즈니스 로직에서는 어차피 실제 사용할 때 로딩이 발생하므로 똑같은 N+1 문제가 발생하게 된다.

따라서 해결방법은 다음과 같다.

1. 페치 조인 사용

```sql
select m from Member m join fetch m.orders
```

2. Hibernate 의 `@BatchSize` 사용

3. Hibernate 의 `@Fetch(FetchMode.SUBSELECT` 사용

**정리를 해보자.**

왠만하면 모두 지연 로딩을 사용한다. 그리고 성능 최적화가 꼭 필요한 곳에서 JPQL 페치 조인을 사용하자.

기본값이 즉시 로딩인 `@OneToOne` 과 `@ManyToOne` 은 지연 로딩 전략으로 바꿔주자.

## 읽기 전용 쿼리의 성능 최적화

엔티티가 영속성 컨텍스트에 관리되면 1차 캐시부터 변경 감지까지 얻을 수 있는 해택이 많다. 하지만 영속성 컨텍스트는 변경 감지를 위해 스냅샨 인스턴스를 보관하므로 더 많은 메모리를 사용하는 단점이 있다. 만약 조회만 하는 엔티티가 있다면 성능 최적화를 위해 읽기 전용으로 엔티티를 조회를 할 수 있다.

방법은 다음과 같다.

1. 스칼라 타입으로 조회

```sql
select o.id, o.name, o.price from order o
```

2. 읽기 전용 쿼리 힌트 사용

```java
TypedQuery<Order> query = em.createQuery("select o from Order o"), Order.class);
query.setHint("org.hibernate.readOnly", true);
```

읽기 전용으로 조회했으므로 영속성 컨텍스트는 스냅샷을 보관하지 않는다. 따라서 메모리를 최적화 할 수 있다. 단 스냅샷이 없으므로 엔티티를 수정해서 데이터베이스에 반영되지 않는다.

3. 읽기 전용 트랜잭션 사용

```java
@Transactional(readOnly = true)
```

트랜잭션을 시작했으므로 트랜잭션 시작, 로직수행, 트랜잭션 커밋의 과정은 이루어진다. 그러나 영속성 컨텍스트를 플러시 하지 않아, 플러시할 때 이루어지는 스냅샨 비교와 같은 무거운 로직들을 수행하지 않아 성능이 향상된다.

4. 트랜잭션 밖에서 읽기

```java
@Transactional(propagation = Propagation.NOT_SUPPORTED)
```

기본적으로 플러시 모드는 AUTO 로 설정되어 있다. 따라서 트랜잭션을 커밋하거나 쿼리를 실행하면 플러시가 작동한다. 그런데 트랜잭션 자체가 존재하지 않으므로 트랜잭션을 커밋할 일이 없다.

스프링 프레임워크에서는 읽기 전용 트랜잭션과 읽기 전용 쿼리 힌트를 동시에 사용하는 것이 효과적이다.

```java
@Transactional(readOnly = true)
public List<DataEntity> findDatas() {
	return em.createQuery("select d from DataEntity d",
			DataEntity.class);
			.setHint("org.hibernate.readOnly", true);
			.getResultList();
}
```

1. 읽기 전용 트랜잭션 사용: 플러시를 작동하지 않도록 해서 성능 향상
2. 읽기 전용 엔티티를 사용: 엔티티를 읽기 전용으로 조회해서 메모리 절약

## 배치 처리

수백만 건의 데이터를 배치 처리해야 하는 상황이라 가정해보자. 일반적인 방식으로 엔티티를 계속 조회하면 영속성 컨텍스트에 아주 많은 엔티티가 쌓이므로 메모리 부족 오류가 발생한다. 따라서 이런 배치 처리는 적절한 단위로 영속성 컨텍스트를 초기화 해야 한다. 또한, 2차 캐시를 사용하고 있다면 2차 캐시에 엔티티를 보관하지 않도록 주의해야 한다.

등록 배치

```java
for (int i=0; i<10000; i++) {
		Product product = new Product("item" + i, 10000);
		em.persist(product);

		// 100 건마다 플러시와 영속성 컨텍스트 초기화
		if (i % 100 ==0) {
					em.flush();
				em.clear();
		}
}
```

배치 처리는 아주 많은 데이터를 조회해서 수정한다. 이때 수많은 메모리를 한 번에 메모리에 올려둘 수 없어서 2가지 방법을 주로 사용한다.

1. 페이징 처리: 데이터베이스 페이징 기능을 사용한다.
2. 커서: 데이터베이스가 지원하는 커서 기능을 사용한다.

수정 배치: 페이징 Example

```java
int pageSize = 100;
for (int i=0; i<10000; i++) {
		List<Product> resultList = em.createQuery("select p from Product p",
				Product.class)
						.setFirstResult(i * pageSize);
						.setMaxResulsts(pageSize)
						.getResultList();

		// 비즈니스 로직 수행
		for (Product product : resultList) {
				product.setPrice(product.getPrice() + 100);
		}
		em.flush();
		em.clear();
}
```

## 트랜잭션을 지원하는 쓰기 지연과 성능 최적화

```java
insert(member1); // INSERT INTO ...
insert(member2); // INSERT INTO ...
insert(member3); // INSERT INTO ...
insert(member4); // INSERT INTO ...
insert(member5); // INSERT INTO ...
commit();
```

네트워크 호출은 단순한 메소드를 수만 번 호출하는 것보다 더 큰 비용이 든다. 위 코드는 5번의 INSERT SQL 과 1번의 커밋으로 총 6번 데이터베이스와 통신한다. 이것을 최적화 하려면 5번의 INSERT SQL 을 모아서 한 번에 데이터베이스로 보내면 된다. JDBC 가 제공하는 SQL 배치 기능을 사용해도 되지만 코드의 많은 부분을 수정해야 하므로, JPA 의 플러시 기능을 이용해 쉽게 구현할 수 있다.

`hibernate.jdbc.batch_size` 속성의 값에 50을 주면 최대 50건씩 모아서 SQL 배치를 실행한다. 하지만 SQL 배치는 같은 SQL 일 때만 유효한다. 중간에 다른 처리가 들어가면 배치를 다시 시작한다. 예를들어보자.

```java
em.persist(new Member()); // 1
em.persist(new Member()); // 2
em.persist(new Member()); // 3
em.persist(new Member()); // 4
em.persist(new Child()); // 5, 다른 연산
em.persist(new Member()); // 6
em.persist(new Member()); // 7
```

따라서 총 3번 SQL 배치를 실행한다.

주의사항
엔티티가 영속 상태가 되려면 식별자가 꼭 필요하다. 그런데 IDENTITY 식별자 생성 전략은 엔티티를 데이터베이스에 저장해야 식별자를 구할 수 있으므로 `em.persist()` 를 호출하는 즉시 `INSERT SQL` 이 데이터베이스에 전달된다. 따라서 쓰기 전략을 활용한 성능 최적화를 할 수 없다.

## 트랜잭션을 지원하는 쓰기 지연과 애플리케이션 확장성

트랜잭션을 지원하는 쓰기 지연과 변경 감지 기능 덕분에 성능과 개발의 편의성이라는 두 마리 토끼를 모두 잡을 수 있었다. 하지만 진짜 장점은 데이터베이스 테이블 로우에 락을 걸리는 시간을 최소화한다는 점이다.
