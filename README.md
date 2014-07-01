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