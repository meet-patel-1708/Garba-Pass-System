package controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.AdminPassService;

@RestController
@RequestMapping("/api/admin/pass")
@RequiredArgsConstructor
public class AdminPassController {
    private final AdminPassService adminPassService;
    @PutMapping("/block/{serialNumber}")
    public ResponseEntity<String> blockPass(@PathVariable String serialNumber){
        return ResponseEntity.ok(adminPassService.blockPass(serialNumber));
    }

    @PutMapping("/unblock/{serialNumber}")
    public ResponseEntity<String> unblockPass(@PathVariable String serialNumber){
        return ResponseEntity.ok(adminPassService.unblockPass(serialNumber));
    }

    @PutMapping("/status/{serialNumber}")
    public ResponseEntity<String> getPassStatus(@PathVariable String serialNumber){
        return ResponseEntity.ok(adminPassService.getPassStatus(serialNumber));
    }

}
