lazy var classificationRequest: VNCoreMLRequest = {
    do {
    // 1
    let healthySnacks = HealthySnacks()
    // 2
    let visionModel = VNCoreMLModel(for: healthySnacks.model)
    // 3
    let request = VNCoreMLRequest(model: visionModel,
                                    completionHandler: {
        [weak self] request, error in
        print("Request is finished!", request.results)
    })
    // 4
    request.imageCropAndScaleOption = .centerCrop
    return request
    } catch {
    fatalError("Failed to create VNCoreMLModel: \(error)")
    }
}()