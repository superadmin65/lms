# Playlist as Reference

Assign the playlist link to the 'list' key.

```js
{
  "type": "chapter",
  "label": "संज्ञा",
  "altLabel": "Noun",
  "id": "chap-1",
  "list": "https://pschool.in/1755028309190"
}
```

# Activity as Reference

Assign a collection as activity to the 'list' key.

```js
{
    label: "✍️ Tracing Letters ",
    list: [
    "https://pschool.in/hi-letter/vowels-writing",
    "https://pschool.in/hi-letter/consonants-writing",
    ],
},

```

In case of PSchool activity, we need to change the background image info. It is
also possible to change label or instruction text.

```js
{
    label: "✍️ Tracing Letters ",
    list: [
        {
            ref:  "https://pschool.in/hi-letter/vowels-writing",
            data: {
                bgData: {
                    "bgImg": "konzeptes/idiom.jpg",
                    "imgWidth": 928,
                    "imgHeight": 700,
                    "width": 500,
                    "height": 650,
                    "left": 250,
                    "top": 20
                }
            }
        },
         {
            "https://pschool.in/hi-letter/consonants-writing",
            data: {
                label: 'New Label',
                bgData: {
                    "bgImg": "konzeptes/idiom.jpg",
                    "imgWidth": 928,
                    "imgHeight": 700,
                    "width": 500,
                    "height": 650,
                    "left": 250,
                    "top": 20
                }
            }
        }
    ],
},
```
