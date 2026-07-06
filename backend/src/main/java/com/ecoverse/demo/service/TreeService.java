package com.ecoverse.demo.service;

import com.ecoverse.demo.entity.User;
import com.ecoverse.demo.entity.TreeLevel;
import com.ecoverse.demo.repository.TreeLevelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class TreeService {

    @Autowired
    private TreeLevelRepository treeLevelRepository;

    public Map<String, Object> getTreeProgress(User user) {
        List<TreeLevel> levels = treeLevelRepository.findAll();
        levels.sort((a, b) -> a.getLevel().compareTo(b.getLevel()));

        TreeLevel current = levels.get(0);
        TreeLevel next = null;

        // Tree growth XP is linked directly to user's overall XP!
        int treeXp = user.getXp();

        for (int i = 0; i < levels.size(); i++) {
            TreeLevel tl = levels.get(i);
            if (treeXp >= tl.getXpRequired()) {
                current = tl;
                if (i + 1 < levels.size()) {
                    next = levels.get(i + 1);
                } else {
                    next = null;
                }
            }
        }

        user.setTreeLevel(current.getLevel());
        user.setTreeXp(treeXp);

        int xpRequiredForNext = (next != null) ? next.getXpRequired() : current.getXpRequired();
        int currentLevelBaseXp = current.getXpRequired();
        int progressInStage = treeXp - currentLevelBaseXp;
        int stageTotalXp = xpRequiredForNext - currentLevelBaseXp;
        
        double progressPercent = (stageTotalXp > 0) 
            ? Math.min((progressInStage * 100.0) / stageTotalXp, 100.0)
            : 100.0;

        Map<String, Object> response = new HashMap<>();
        response.put("level", current.getLevel());
        response.put("stageName", current.getStageName());
        response.put("currentXp", treeXp);
        response.put("nextStageXp", xpRequiredForNext);
        response.put("progressPercent", progressPercent);
        response.put("imageUrl", current.getImageUrl());
        return response;
    }
}
