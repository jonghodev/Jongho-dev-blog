# Proxy 심화 주제

### 영속성 컨텍스트 프록시

---

`Proxy` 로 조회해도 `em.find()` 를 통해 조회해도 엔티티의 동일성은 보장된다.

먼저 proxy 를 조회하고 원본 엔티티를 조회해보자.

```java
Member refMember = em.getReference(Member.class, "member1");
Member findMember = em.find(Member.class, "member1");

System.out.println(refMember.getClass());
System.out.println(findMember.getClass());

Assert.assertTrue(refMember == findMember);
```

각각의 출력 값은 `class jpabook.advanced.Member_$$_jvst843_0` 으로 같다.

Proxy 를 조회 후 같은 식별자 아이디로 조회를 하게 되면 Proxy 가 넘어온다는 것을 알 수 있다. 그 이유는 그래야 그 둘을 비교했을 때 같은 인스턴스임을 보장할 수 있기 때문이다. 그리고 클라이언트 입장에서는 조회한 엔티티가 프록시인지 아닌지 구분하지 않고 사용할 수 있다.

이제 원본 엔티티를 조회하고 프록시를 조히해보자.

```java
Member findMember = em.find(Member.class, "member1");
Member refMember = em.getReference(Member.class, "member1");

System.out.println(refMember.getClass());
System.out.println(findMember.getClass());

Assert.assertTrue(refMember == findMember);
```

각각의 출력 값은 `class jpabook.advanced.Member` 으로 같다.

원본 엔티티를 먼저 조회하면 영속성 컨텍스트는 원본 엔티티를 이미 데이터베이스에서 조회했으므로 `em.getReference()` 를 호출해도 원본을 반환한다.

### 프록시 타입 비교

---

프록시는 원본 엔티티를 상속 받아서 만들어지므로 프록시로 조회한 엔티티의 타입을 비교할 때는 `==` 비교를 하면 안 되고 대신에 `instanceof` 를 사용해야 한다.

```java
Member member = new Member("member1");
em.persist(member);
em.flush();
em.clear();

Member refMember = em.getReference(Member.class, "member1");

Assert.assertFalse(Member.class == refMember.getClass());
Assert.assertTrue(refMember instanceof Member);
```

### 프록시 동등성 비교

---

엔티티드의 동등성을 비교하려면 비즈니스 키를 이용해 `equals()` 메소드를 오버라이딩하고 비교하면 된다. 그런데 IDE 나 외부 라이브러리를 사용해 구현한 `equals()` 메소드로 엔티티를 비교할 때, 비교 대상이 원본 엔티티면 문제가 없지만 프록시면 문제가 발생할 수 있다.

```java
@Entity
public class Member {

	@Id
	private String id;
	private String juminNo;
	
	public String getJuminNo() { return juminNo; }
	public String setJuminNo(String juminNo) { this.juminNo = juminNo; }
	
	@Override
	public boolean equals(Object obj) {
		if (this == obj) return true;
		if (!(obj instanceof Member)) return false; // (1)
		
		Member member = (Member) obj;
		
		// (2)
		if (juminNo != null ? !juminNo.equals(member.getName()) :
				member.getName() != null)
				return false;
		
		return true;
	}
	
	
}
```

(1)

이곳에서는 this.getClass() 와 obj.getClass() 를 비교할게 아니라 Proxy 가 들어올 것을 대비해, instanceof 로 비교를 해야한다.

(2)

`member.juminNo` 으로 접근하게 되면 문제가 생긴다. 왜냐면 Proxy 가 들어오게 되면 해당 객체는 멤버 변수에 접근해도 아무 값도 얻을 수 없기 때문이다. 따라서 Getter 접근자를 사용해야 한다. 따라서 `member.getJuminNo()` 을 사용했다.

**따라서 정리하자면 `Proxy` 의 동등성을 비교할 때는 2가지를 주의해야 한다.**

1. `Proxy` 타입 비교는 `==` 비교 대신에 `instanceof` 를 사용한다.
2. `Proxy` 의 멤버변수에 직접 접근하면 안 되고 대신에 접근자`Getter` 메소드를 사용해야 한다.

### 상속 관계와 프록시

---

**프록시를 부모 타입으로 조회하면 문제가 발생한다.** 왜냐면 그 `Proxy` 는 그 실제 클래스의 자식과는 관계가 없기 때문에 `instanceof` 연산을 통해 실제 논리적 관계를 알아낼 수 없기 때문이다.

따라서 해결방법은 다음과 같다.

1. JPQL 로 대상 직접 조회
2. 프록시를 벗긴다.