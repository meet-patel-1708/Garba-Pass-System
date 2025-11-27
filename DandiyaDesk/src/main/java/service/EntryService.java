package service;

import lombok.RequiredArgsConstructor;
import model.GeneratedPass;
import model.Pass;
import org.springframework.stereotype.Service;
import repository.GeneratedPassRepo;
import repository.PassRepo;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EntryService {

    private final GeneratedPassRepo passRepo;

    public Map<String, Object> allowEntryAfterOtp(String serialNumber) {
        Optional<GeneratedPass> passOptional = passRepo.findBySerialNumber(serialNumber);

        if (passOptional.isEmpty()) {
            throw new RuntimeException("Pass not found");
        }

        GeneratedPass pass = passOptional.get();

        if (pass.getRemainingDays() <= 0) {
            throw new RuntimeException("Pass has no remaining days. Entry denied.");
        }

        // Decrement remaining days
        pass.setRemainingDays(pass.getRemainingDays() - 1);
        pass.setUsedDays(pass.getUsedDays() + 1);
        passRepo.save(pass);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Entry allowed successfully");
        response.put("passId", pass.getSerialNumber());
        response.put("remainingDays", pass.getRemainingDays());
        response.put("usedDays", pass.getUsedDays());
        response.put("success", true);

        return response;
    }
}