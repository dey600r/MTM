import { BodySkeletonInputModel, BodySkeletonLabelsInputModel, SkeletonInputModel } from "@models/index";

export const HomeSkeletonSetting : SkeletonInputModel = new SkeletonInputModel({
    time: 1700, 
    itemsHeader: [2, 4, 2, 4],
    body: new BodySkeletonInputModel({
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 
      avatar: true, 
      itemsLabel: [ 
        new BodySkeletonLabelsInputModel({ h3Width: 85, divWidth: 75, divPWidth: [25, 25, 25, 25] }),
      ] 
    })
  });

export const VehicleSkeletonSetting: SkeletonInputModel = new SkeletonInputModel({
    time: 1000, 
    itemsHeader: [4, 8],
    body: new BodySkeletonInputModel({
      items: [1, 2, 3, 4], 
      avatar: true, 
      itemsLabel: [ 
        new BodySkeletonLabelsInputModel({ h3Width: 70, h2Width: 30, pWidth: [60] }),
        new BodySkeletonLabelsInputModel({ pWidth: [45, 60] })
      ] 
    })
  });

export const OperationSkeletonSetting: SkeletonInputModel = new SkeletonInputModel({
    time: 1000, 
    itemsHeader: [2, 4, 2, 4],
    body: new BodySkeletonInputModel({
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 
      avatar: true, 
      itemsLabel: [ 
        new BodySkeletonLabelsInputModel({ h3Width: 70, h2Width: 40 }),
        new BodySkeletonLabelsInputModel({ h3Width: 60, h2Width: 30 })
      ] 
    })
  });

export const ConfigurationSkeletonSetting: SkeletonInputModel = new SkeletonInputModel({
    time: 1000, 
    itemsHeader: [1, 3, 1, 3, 1, 3],
    body: new BodySkeletonInputModel({
      items: [1, 2, 3, 4, 5, 6], 
      avatar: true, 
      itemsLabel: [ new BodySkeletonLabelsInputModel({ h3Width: 40, pWidth: [70] })] 
    })
  });

export const InfoVehicleConfSummarySkeletonSetting: BodySkeletonInputModel = new BodySkeletonInputModel({
    items: [1, 2, 3, 4, 5, 6, 7, 8], 
    avatar: true, 
    itemsLabel: [ 
      new BodySkeletonLabelsInputModel({ h3Width: 70, divWidth: 60, divPWidth: [35, 35] })
    ] 
  });

export const InfoVehicleReplSummarySkeletonSetting: BodySkeletonInputModel = new BodySkeletonInputModel({
    items: [1, 2, 3, 4, 5, 6, 7, 8], 
    avatar: true, 
    itemsLabel: [ 
      new BodySkeletonLabelsInputModel({ h3Width: 100, divWidth: 75, divPWidth: [60, 60] }),
      new BodySkeletonLabelsInputModel(),
      new BodySkeletonLabelsInputModel({ pWidth: [60, 60, 60] })
    ] 
  });