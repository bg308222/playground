#!/usr/bin/env sh
private_key_path="./private/cluster.pkcs8.pem"
public_key_path="./public/cluster.spki.pem"

if [ -f $private_key_path ] || [ -f $public_key_path ]; then
  echo "Keys already exist"
  exit 0
fi

mkdir -p `dirname $private_key_path` `dirname $public_key_path`
openssl genpkey -algorithm RSA -out $private_key_path -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in $private_key_path -out $public_key_path
chmod 444 $private_key_path $public_key_path
