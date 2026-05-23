package com.rodapp.backend.controller;

import com.rodapp.backend.model.Tanqueada;
import com.rodapp.backend.service.TanqueadaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tanqueadas")
public class TanqueadaController {

    @Autowired
    private TanqueadaService tanqueadaService;

    @PostMapping
    public ResponseEntity<Tanqueada> crear(@RequestBody Tanqueada tanqueada) {
        return ResponseEntity.status(201).body(tanqueadaService.crear(tanqueada));
    }

    @GetMapping
    public List<Tanqueada> listar() {
        return tanqueadaService.listar();
    }

    @GetMapping("/moto/{motoId}")
    public List<Tanqueada> obtenerPorMoto(@PathVariable Long motoId) {
        return tanqueadaService.obtenerPorMoto(motoId);
    }
}
