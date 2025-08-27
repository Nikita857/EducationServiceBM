package com.bm.education.services;

import com.bm.education.dto.ViewModuleDto;
import com.bm.education.models.Tasks;
import com.bm.education.repositories.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public List<ViewModuleDto> getTasksWithProgress(Integer userId, Integer moduleId) {
        List<Object[]> results = taskRepository.findLessonsByModuleAndUserId(userId, moduleId);
        return results.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private ViewModuleDto mapToDTO(Object[] result) {
        return new ViewModuleDto(
                ((Integer) result[0]),        // id
                (String) result[1],                     // title
                (String) result[2],                     // short_description
                (String) result[3],                     // module_title
                (String) result[4],                     // course_title
                ((Integer) result[5]),                    // completed
                result[6] != null ? ( (java.sql.Timestamp) result[6]).toLocalDateTime(): null // completed_at
        );
    }
}
