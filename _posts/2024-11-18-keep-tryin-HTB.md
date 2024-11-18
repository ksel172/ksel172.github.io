---
layout: post
title: "HTB Challenge: Keep Tryin' (Forensics Challenge)"
author: ksel172
category: HTB
tags: HTB Forensics
---


###Description: This packet capture seems to show some suspicious traffic

##Challenge

When we start with the challenge we are greeted by a pcap file with surprisingly very little traffic.

![PCAP Capture](assets/img/blogs/2024-11-18-keep-tryin-HTB/image1.png)

Instantly we notice 2 very specific requests: a POST request to ``/lootz`` and a POST request to ``/flag``, the other eye-catching packets are the first 4 DNS packets at the beginning of the capture.

Starting off I checked the request to ``lootz`` by viewing the whole TCP stream. 

![/lootz](assets/img/blogs/2024-11-18-keep-tryin-HTB/image2.png)

Decoding the base64 gives us the following result:

```
┌──(kali)-[~]
└─$ echo "S2VlcCB0cnlpbmcsIGJ1ZmZ5Cg==" | base64 -d
Keep trying, buffy
```

Hmm, not too helpful. Next I checked out the POST request to ``/flag``:

![/flag](assets/img/blogs/2024-11-18-keep-tryin-HTB/image3.png)

TryHarder? Ok... Let's see what that is. 

![packet](assets/img/blogs/2024-11-18-keep-tryin-HTB/image4.png)

Looking at the bottom of the request we see that the value belongs to a form with the value ``Key:``, this might be useful.
Continuing onwards I decided to check out the DNS requests. First I followed a stream which seems to have more base64 embedded in a TXT record.

![packet](assets/img/blogs/2024-11-18-keep-tryin-HTB/image5.png)

```
┌──(kali)-[~]
└─$ echo "c2VjcmV0LnR4dHwx" | base64 -d
secret.txt|1
```
That's interesting! seems like a name of a file but considering it's in a request it might be a header from a file! Let's continue and see where this brings us.

![packet](assets/img/blogs/2024-11-18-keep-tryin-HTB/image6.png)

This steam also has a TXT record with base64, however when I exracted the base64 and tried decoding it, I got random characters, meaning it's probably encrypted. I first

![packet](assets/img/blogs/2024-11-18-keep-tryin-HTB/image7.png)

It's encrypted. First I changed my base64 to urlsafeB64 considering the format and after thinking of a few options I remembered the ``Key`` value we find earlier with the contents ``TryHarder``. After trying and failing a few encryptions in CyberChef I reached RC4 and got a result!

![result](assets/img/blogs/2024-11-18-keep-tryin-HTB/image8.png)

This definitely looks like it might be a file! Using the inbuilt download function in CyberChef I downloaded the file and it gave me the secret.txt file.

![secret.txt](assets/img/blogs/2024-11-18-keep-tryin-HTB/image9.png)

And we get the flag: ```HTB{$n3aky_DN$_Tr1ck$}```
