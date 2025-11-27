package service;

import org.springframework.stereotype.Service;
import repository.PassRepo;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminDashboardService {

    private final PassRepo passRepo;

    public AdminDashboardService(PassRepo passRepo) {
        this.passRepo = passRepo;
    }

    public Map<String, Object> getDashboardSummury() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("activePassCount", passRepo.countActivePasses());
        summary.put("blockedPassCount", passRepo.countBlockedPasses());
        summary.put("expiredPassCount", passRepo.countExpiredPasses());
        summary.put("totalPassCount", passRepo.count());
        return summary;
    }

    public Map<String, Object> getDetailedLists() {
        Map<String, Object> details = new HashMap<>();
        details.put("activePasses", passRepo.findByActiveTrue());
        details.put("blockedPasses", passRepo.findByActiveFalse());
        details.put("expiredPasses", passRepo.findExpiredPasses());
        return details;
    }
}
