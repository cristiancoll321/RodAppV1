package com.rodapp.backend.service;

import com.rodapp.backend.model.Tanqueada;
import com.rodapp.backend.repository.TanqueadaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TanqueadaService {

    @Autowired
    private TanqueadaRepository tanqueadaRepository;

    public Tanqueada crear(Tanqueada tanqueada) {
        return tanqueadaRepository.save(tanqueada);
    }

    public List<Tanqueada> listar() {
        return tanqueadaRepository.findAll();
    }

    public List<Tanqueada> obtenerPorMoto(Long motoId) {
        return tanqueadaRepository.findByMotocicletaId(motoId);
    }
}
