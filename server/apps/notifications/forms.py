from django import forms


class BroadcastForm(forms.Form):
    title = forms.CharField(max_length=120, label="Title")
    body = forms.CharField(widget=forms.Textarea(attrs={"rows": 4}), label="Message", required=False)
