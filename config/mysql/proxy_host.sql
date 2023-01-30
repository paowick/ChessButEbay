USE npm;
INSERT INTO `proxy_host` (`id`, `created_on`, `modified_on`, `owner_user_id`, `is_deleted`, `domain_names`, `forward_host`, `forward_port`, `access_list_id`, `certificate_id`, `ssl_forced`, `caching_enabled`, `block_exploits`, `advanced_config`, `meta`, `allow_websocket_upgrade`, `http2_support`, `forward_scheme`, `enabled`, `locations`, `hsts_enabled`, `hsts_subdomains`) VALUES
(1, '2023-01-30 09:20:32', '2023-01-30 09:20:33', 1, 0, '[\"localhost\"]', 'web', 8080, 0, 0, 0, 1, 1, '', '{\"letsencrypt_agree\":false,\"dns_challenge\":false,\"nginx_online\":true,\"nginx_err\":null}', 1, 0, 'http', 1, '[{\"path\":\"/socket.io\",\"advanced_config\":\"\",\"forward_scheme\":\"http\",\"forward_host\":\"sever\",\"forward_port\":8080}]', 0, 0);

