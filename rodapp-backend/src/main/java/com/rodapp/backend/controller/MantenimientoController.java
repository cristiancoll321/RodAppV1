package com.rodapp.backend.controller;

import com.rodapp.backend.model.Mantenimiento;
import com.rodapp.backend.service.MantenimientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mantenimientos")
public class MantenimientoController {

    @Autowired
    private MantenimientoService mantenimientoService;

    /**
      * ENDPOINT: GET /api/mantenimientos
      * Propósito: Obtener el historial global de mantenimientos.
      * Viaje del dato: El servicio recupera la lista total y Spring la serializa a JSON.
      */
    @GetMapping
    public List<Mantenimiento> listar() {
        return mantenimientoService.getMantenimientos();
    }

    /**
      * ENDPOINT: POST /api/mantenimientos
      * Propósito: Registrar un nuevo servicio técnico o reparación.
      * Viaje del dato: El JSON del frontend es convertido a objeto Mantenimiento por Jackson.
      */
    @PostMapping
    public ResponseEntity<Mantenimiento> crear(@RequestBody Mantenimiento mantenimiento) {
        return ResponseEntity.status(201).body(mantenimientoService.registrar(mantenimiento));
    }

    /**
      * ENDPOINT: PUT /api/mantenimientos/{id}
      * Propósito: Corregir o actualizar información de un mantenimiento.
      * Viaje del dato: Recibe ID por URL y nuevos datos por JSON; el servicio actualiza la entidad.
      */
    @PutMapping("/{id}")
    public ResponseEntity<Mantenimiento> actualizar(@PathVariable Long id, @RequestBody Mantenimiento mantenimiento) {
        return ResponseEntity.ok(mantenimientoService.actualizar(id, mantenimiento));
    }

    /**
      * ENDPOINT: DELETE /api/mantenimientos/{id}
      * Propósito: Eliminar un registro de mantenimiento.
      * Viaje del dato: Ejecuta el borrado en la DB y retorna un código 204 (No Content).
      */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        mantenimientoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/moto/{motoId}")
    public List<Mantenimiento> obtenerPorMoto(@PathVariable Long motoId) {
        return mantenimientoService.obtenerPorMoto(motoId);
    }

    /**
     * ENDPOINT: GET /api/mantenimientos/usuario/{usuarioId}
     * Propósito: Obtener el historial de mantenimientos de todas las motos de un usuario.
     * @param usuarioId ID del usuario.
     * @return Lista de mantenimientos.
     */
    @GetMapping("/usuario/{usuarioId}")
    public List<Mantenimiento> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return mantenimientoService.obtenerPorUsuario(usuarioId);
    }
}
