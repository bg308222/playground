#!/bin/bash

cat <<EOF | nc -v -C localhost 27
HELO localhost
MAIL FROM:<sender@example.com>
RCPT TO:<recipient@example.com>
DATA
Subject: Test Email
From: sender@example.com
To: recipient@example.com

This is a test email from simple postfix service.
.
QUIT
EOF