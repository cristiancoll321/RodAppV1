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

    @PostMapping
    public ResponseEntity<Motocicleta> crear(@RequestBody Motocicleta moto){
        return ResponseEntity.status(201).body(motoService.registrar(moto));

    }

    @GetMapping
    public List<Motocicleta> getMotocicleta(){
        return  this.motoService.getMotocicletas();
    }

}
