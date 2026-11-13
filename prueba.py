# Listas [], tuplas (), y diccionarios {}
colores = ["Azul", "Rojo", "Amarillo", "Verde"]
frutas = ("Naranja", "Piña", "Borojo")
jugadores = {1: "Higuita", 7: "Cuadrado", 23: "Mina"}

print("colores: ", type(colores))
print("frutas: ", type(frutas))
print("Jugadores: ", type(jugadores))


color_uno = colores[0]
if color_uno == "Azul":
    print("El primer color es Azul y vale 10 puntos.")
else:
    print("Es otro color.")

fruta_uno = frutas[1]
if fruta_uno == "Piña":
    print(f"Seleccionaste {fruta_uno} y tiene un valor base.")
else:
    print("Otra fruta.")


jugador_uno = jugadores[7]
if jugador_uno == "Cuadrado":
    print(f"El jugador 7 es {jugador_uno}.")
else:
    print("Jugador no encontrado.")