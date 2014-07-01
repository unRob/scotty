# Scotty

**scotty*** del *startrekismo*, "Beam me up, Scotty"

!["Beam me up!"](http://www.crystalinks.com/beamtransporter.jpg)

## Ingredientes

* [Tessel](http://technical.io) ó cualquier microcomputadora con wifis que corra Javascript
* Una batería USB 5v/~2A como [esta](http://www.monoprice.com/Product?c_id=108&cp_id=10831&cs_id=1083110&p_id=10392&seq=1&format=2)
* Transistor BD135
* Resitencia 100Ω
* Un botón de elevador (el elevador de acá es un Otis 200, nos conectamos al pin 2,3 de la terminal conectada al botón)
* Una línea telefónica SIP (opcional)

## ¿Y luego?

1. Hay de dos sopas:
    * Entras a un webapp y te autenticas, o
    * marcas a un número telefónico, y si estás en el whitelist
2. Esperas ~2s
3. ??
4. PROFIT!!!1!!ONCE!! El elevador de mi casa se abre!

[Algo así](https://www.youtube.com/watch?v=T4Q0tdFq0FQ)

## Setup eléctrico
!["Fritzing stuff"](https://raw.github.com/unRob/scotty/master/layout.png)

Alimentamos el transistor con GND de GPIO y G1 (digital[0])

## Licencia

Hasta la pregunta ofende, pero ahora haremos dual license: WTFPL y BOLA:

```
DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE Version 2, December 2004

(C) 2014 Roberto Hidalgo un@rob.mx, Those listed at CONTRIBUTORS

Everyone is permitted to copy and distribute verbatim or modified copies
of this license document, and changing it is allowed as long as the name
is changed.

DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

You just DO WHAT THE FUCK YOU WANT TO.
```

```
BOLA - Buena Onda License Agreement (v1.1)
------------------------------------------

This work is provided 'as-is', without any express or implied warranty. In no
event will the authors be held liable for any damages arising from the use of
this work.

To all effects and purposes, this work is to be considered Public Domain.


However, if you want to be "buena onda", you should:

1. Not take credit for it, and give proper recognition to the authors.
2. Share your modifications, so everybody benefits from them.
3. Do something nice for the authors.
4. Help someone who needs it: sign up for some volunteer work or help your
   neighbour paint the house.
5. Don't waste. Anything, but specially energy that comes from natural
   non-renewable resources. Extra points if you discover or invent something
   to replace them.
6. Be tolerant. Everything that's good in nature comes from cooperation.
```