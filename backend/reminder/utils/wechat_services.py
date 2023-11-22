# your_app/utils/wechat_services.py

import requests
from django.conf import settings

def get_access_token():
    url = f"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={settings.WECHAT_APPID}&secret={settings.WECHAT_SECRET}"
    response = requests.get(url)
    data = response.json()
    return data.get("access_token")

def send_service_notification(openid, template_id, data, page=None):
    access_token = get_access_token()
    url = f"https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token={access_token}"
    payload = {
        "touser": openid,
        "template_id": template_id,
        "data": data,
    }
    if page:
        payload["page"] = page
    response = requests.post(url, json=payload)
    return response.json()
