package controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.EntryService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/entry")
@RequiredArgsConstructor
public class EntryController {

    private final EntryService entryService;

    @PostMapping("/scan")
    public ResponseEntity<Map<String, Object>> scanPass(@RequestParam String serialNumber) {
        Map<String, Object> result = entryService.allowEntryAfterOtp(serialNumber);
        return ResponseEntity.ok(result);
    }
}
