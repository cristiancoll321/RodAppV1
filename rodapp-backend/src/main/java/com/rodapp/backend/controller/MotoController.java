package com.rodapp.backend.controller;

import com.rodapp.backend.model.Motocicleta;
import com.rodapp.backend.service.MotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/motos")
public class MotoController {
    @Autowired
    private MotoService motoService;

    /**
     * ENDPOINT: POST /api/motos
     * Propósito: Recibir datos desde un formulario de registro en el frontend.
     * Viaje del dato: El JSON del frontend es transformado automáticamente por Spring (Jackson)
     * en un objeto 'Motocicleta' gracias a @RequestBody.
     * @param moto Objeto mapeado desde el cuerpo de la petición HTTP.
     * @return ResponseEntity con el objeto creado y código 201 (Created).
     */
    @PostMapping
    public ResponseEntity<Motocicleta> crear(@RequestBody Motocicleta moto){
        return ResponseEntity.status(201).body(motoService.registrar(moto));
    }

    /**
     * ENDPOINT: GET /api/motos
     * Propósito: Listar todas las motos para mostrarlas en una tabla o galería.
     * Viaje del dato: Solicita al servicio la lista y Spring la convierte a un JSON Array
     * para enviarla de vuelta al navegador.
     * @return Lista de motocicletas en formato JSON.
     */
    @GetMapping
    public List<Motocicleta> getMotocicleta(){
        return  this.motoService.getMotocicletas();
    }

    /**
     * ENDPOINT: GET /api/motos/{id}
     * Propósito: Ver los detalles de una sola moto seleccionada.
     * Viaje del dato: El ID viaja en la URL (ej: /api/motos/5). @PathVariable lo extrae
     * para que el servicio pueda buscarlo.
     * @param id El identificador que viene en la URL.
     * @return El objeto Motocicleta solicitado.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Motocicleta> getPorId(@PathVariable Long id) {
        return ResponseEntity.ok(motoService.getMotoPorId(id));
    }

    /**
     * ENDPOINT: PUT /api/motos/{id}
     * Propósito: Modificar datos de una moto ya existente.
     * Viaje del dato: Recibe el ID por URL y los nuevos datos por JSON en el cuerpo.
     * El servicio se encarga de mezclarlos y persistirlos.
     * @param id ID de la moto a actualizar.
     * @param moto Datos nuevos.
     * @return El objeto actualizado.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Motocicleta> actualizar(@PathVariable Long id, @RequestBody Motocicleta moto) {
        return ResponseEntity.ok(motoService.actualizar(id, moto));
    }

    /**
     * ENDPOINT: DELETE /api/motos/{id}
     * Propósito: Quitar una moto del sistema.
     * Viaje del dato: Solo requiere el ID. Si la operación tiene éxito, retorna un código
     * 204 (No Content), indicando que se borró y no hay nada más que mostrar de ese recurso.
     * @param id ID de la moto a eliminar.
     * @return Respuesta vacía con estado 204.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        motoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
