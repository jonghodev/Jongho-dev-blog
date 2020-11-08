---
title: AWS CloudFront, ELB Timeout 관련 주의사항
date: 2020-11-08 10:11:57
category: cloud
draft: false
---

AWS 에서 CloudFront 와 ELB 를 사용할 때 주의점을 알아보자.

이 글은 회사에서의 내 경험에 비추어 작성을 했다.

우리 회사의 서비스는 특성상 하나의 요청의 시간이 긴 경우가 많다. 30초를 넘는 경우도 있다. TTS 서비스이기 때문에 긴 문장을 보내면 Timeout 이 길어진다.

우리는 백엔드 서버를 CloudFront 에서 연결하여 사용하고 Behavior 로 ELB 로 연결해서 로드밸런싱을 하고 있다.

처음에 Default Timeout 으로, Cloudfront 30 초 ELB 60초로 되어있다. 그래서 30초가 넘으면 요청이 끊기니 이 시간을 늘려야 한다.

CloudFront 같은 경우는 기본적으로 제한이 되어있으므로 AWS 에 문의해서 목적을 밝히고 Limit 을 늘려야 한다.

따라서 우리 회사는 CloudFront timeout 을 120초까지 늘리고 ELB 도 늘렸다.

## 관련 글

https://aws.amazon.com/ko/premiumsupport/knowledge-center/resolve-http-504-errors-cloudfront/
https://aws.amazon.com/blogs/aws/elb-idle-timeout-control/#:~:text=When%20your%20web%20browser%20or,is%20set%20to%2060%20seconds
