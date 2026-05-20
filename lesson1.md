# La Ley 1273 de 2009: Delitos Informáticos en Colombia

Como ingenieros de software, estamos acostumbrados a construir sistemas y optimizar algoritmos. Sin embargo, en la **Computación Forense**, nuestra misión cambia radicalmente: debemos entender cómo la ley castiga a quienes usan el software para dañar a otros.

En Colombia, la **Ley 1273 de 2009** es nuestra "hoja de ruta". Esta ley modificó el Código Penal para crear un nuevo bien jurídico protegido: **la protección de la información y de los datos**.

---

## 1. Conceptos Fundamentales de Criminalística Digital

Para que un incidente informático sea procesable legalmente, como peritos debemos identificar tres elementos clave durante nuestra investigación:

### A. El Bien Jurídico Tutelado

Es el valor social que la ley protege. En la informática forense, no protegemos el "hardware" (la computadora física), sino los datos. Se protege la **Tríada de la Seguridad (CIA)**:

- **Confidencialidad:** Protección contra acceso no autorizado.
- **Integridad:** Protección contra modificaciones no autorizadas.
- **Disponibilidad:** Garantía de acceso al sistema cuando se requiera.

### B. Los Sujetos del Delito

En un reporte forense, identificarás a dos actores principales:

| Sujeto            | Definición                         | Ejemplo en el ámbito técnico                   |
| :---------------- | :--------------------------------- | :--------------------------------------------- |
| **Sujeto Activo** | Quien comete la acción delictiva.  | Un atacante externo, un empleado deshonesto.   |
| **Sujeto Pasivo** | Quien recibe el daño (la víctima). | Una entidad bancaria, un ciudadano, el Estado. |

---

## 2. Tipificación de Delitos (Artículos Clave)

Como investigador, tu evidencia técnica servirá para que un juez determine si se cometió alguno de estos delitos específicos:

### Art. 269A: Acceso Abusivo a Sistema Informático

- **Definición:** Entrar en un sistema sin autorización o excediendo la que se tiene.
- **Evidencia Forense:** Logs de autenticación (Event Viewer), registros de sesiones RDP activas, bypass de firewalls o detección de _brute force_.

### Art. 269F: Violación de Datos Personales

- **Definición:** Obtener, vender, comprar o usar bases de datos con información personal sin permiso previo.
- **Evidencia Forense:** Hallazgo de archivos `.csv`, `.sql` o volcados de memoria con datos sensibles (nombres, tarjetas de crédito) en el equipo del sospechoso.

---

## 3. El Rol del Ingeniero en la Investigación

A diferencia de la ciberseguridad defensiva, donde el objetivo es detener el ataque en tiempo real, en la **Informática Forense** analizamos el incidente **Post-Mortem** (después de que ocurrió).

```javascript
// Ejemplo de lógica que aplicaría un script de triaje forense
const analyzeIncident = (logEntry) => {
  const { statusCode, loginAttempts, userRole } = logEntry

  if (statusCode === 401 && loginAttempts > 50) {
    return 'Evidencia de intento de Acceso Abusivo (Art. 269A)'
  }

  if (userRole === 'guest' && logEntry.action === 'DB_EXPORT') {
    return 'Posible Violación de Datos Personales (Art. 269F)'
  }

  return 'Actividad requiere revisión manual'
}
```

---

## 4. Laboratorio Rápido: Caso de Intrusión Nocturna

Escenario: El domingo a las 3:00 AM, el sistema de alertas detectó que el usuario admin_contabilidad ingresó al servidor de nómina desde una IP ubicada en otro país. El administrador real reporta que su equipo estaba apagado.

**Análisis del Perito (Tú):**

1. **Preservación:** No reiniciar el servidor para no perder los artefactos en la Memoria RAM (donde residen los procesos activos del atacante).

2. **Identificación:** Localizar la IP de origen y contrastarla con los logs de la VPN para identificar al Sujeto Activo.

3. **Tipificación Legal:**
   - Si el intruso solo entró: Art. 269A (Acceso abusivo).
   - Si el intruso descargó la lista de salarios: Art. 269F (Violación de datos).
   - Si el intruso borró los logs para no ser visto: Art. 269E (Uso de software malicioso o daño informático).
