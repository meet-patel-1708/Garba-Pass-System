package controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import service.AdminDashboardService;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    // ✅ Manual constructor (Spring will autowire this)
    public AdminDashboardController(AdminDashboardService adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String,Object>> getSummary(){
        return ResponseEntity.ok(adminDashboardService.getDashboardSummury());
    }

    @GetMapping("/details")
    public ResponseEntity<Map<String,Object>> getDetails(){
        return ResponseEntity.ok(adminDashboardService.getDetailedLists());
    }
}
