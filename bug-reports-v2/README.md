[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FThisable-Dev%2Fcc-thisable%2Ftree%2Fmain%2Fbug-reports-v2&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false)](https://hits.seeyoufarm.com)


# Bug Reports API Implementation

What is **Bug Report**? A bug report is a specific report that outlines information about what is wrong and needs fixing within App. The report lists reasons, or seen errors, to point out exactly what is viewed as wrong, and also includes a request and/or details for how to address each issue. [References](https://bugherd.com/blog/bug-reporting/#:~:text=A%20bug%20report%20is%20a,how%20to%20address%20each%20issue.)

How is that **important**? Bug reporting helps smooth out software, so that it does what it needs to, without frustrating the people using it. Nobody wants to work with software that doesn’t behave as expected. It’s a terrible user experience. [References](https://bugherd.com/blog/bug-reporting/)


## Table of Contents
<details open>
<summary><b>(click to expand or hide)</b></summary>
<!-- MarkdownTOC -->

1. [Code explanation and references](#code-and-references)
1. [Google Cloud Platform Infrastructure](#gcp-infrastructure)
  
<!-- /MarkdownTOC -->
</details>

<a id="code-and-references"></a>
## Code Explanation and References
  
<a id="gcp-infrastructure"></a>
## Google Cloud Platform Infrastructure
### Installation
Bug Reports API uses [GCE/VM Instances](https://cloud.google.com/compute/docs/instances) and [Firewall](https://cloud.google.com/vpc/docs/firewalls#firewall_rule_components) to run

### Deploy VM Instance
```sh
gcloud compute instances create bugreports-server-vm-1 --project=devthisable --zone=asia-southeast2-b --machine-type=e2-micro --network-interface=network-tier=PREMIUM,subnet=default --metadata=^,@^ssh-keys=c2297f2531:ecdsa-sha2-nistp256\ AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBL2j1\+DliXi7BerhfCI4WcMVClWBQAVQepY4j7Vl9j5QR4rT/fUXoIr6q4TI4NkiUWhA2IH9y7QXsNwBkxzTOPA=\ google-ssh\ \{\"userName\":\"c2297f2531@bangkit.academy\",\"expireOn\":\"2022-06-08T11:16:52\+0000\"\}$'\n'c2297f2531:ssh-rsa\ AAAAB3NzaC1yc2EAAAADAQABAAABAQCLeoTU2\+9FZwfLOHMPFoPi1/G9KOB3Lvz8AE5QschheHobXC30WfmEwws3u1ivUaJm9ZwxFb1QkjIrleE55oLXCTv0ZUAtcVpzHfuujWocY7HlrijOaIicz/74gll7Rmy6PLmJApfiVOvCo9J7j1zhDuBSfP8trDXhOAkthNWbYUzlC0DZWLxNh/ik\+Otq3WmExVukKvfDZsU0X\+xxO0EeN2NK1u1DnNVQm3xTUsBmnoUH2FOMaPUNWXdZP54mLwCHjBkPsTxzyWcM32caORGU0c5dD3rrKK8AwTNvjiQ/tRj6r39aJJMDJu7bhTj6NeEvYIhoy87s\+MOg/Q1jYGTJ\ google-ssh\ \{\"userName\":\"c2297f2531@bangkit.academy\",\"expireOn\":\"2022-06-08T11:17:08\+0000\"\} --maintenance-policy=MIGRATE --provisioning-model=STANDARD --service-account=76310350536-compute@developer.gserviceaccount.com --scopes=https://www.googleapis.com/auth/devstorage.read_only,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring.write,https://www.googleapis.com/auth/servicecontrol,https://www.googleapis.com/auth/service.management.readonly,https://www.googleapis.com/auth/trace.append --tags=app-server,http-server,https-server --create-disk=auto-delete=yes,boot=yes,device-name=bugreports-server-vm,image=projects/ubuntu-os-cloud/global/images/ubuntu-2004-focal-v20220419,mode=rw,size=10,type=projects/devthisable/zones/asia-southeast2-b/diskTypes/pd-balanced --no-shielded-secure-boot --shielded-vtpm --shielded-integrity-monitoring --reservation-affinity=any
```

### Create Firewall rule to allow ingress connection to VM
```sh
gcloud compute --project=devthisable firewall-rules create bugreport-fw-allow-access --description="this firewall is to allow public request to access the bug reports handler in the port 5000" --direction=INGRESS --priority=1000 --network=default --action=ALLOW --rules=tcp:5000,tcp:22,tcp:3389,tcp:0-65535,icmp --source-ranges=0.0.0.0/0 --target-tags=app-server
```
